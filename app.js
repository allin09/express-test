var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var sassMiddleware = require('node-sass-middleware')
var favicon = require('serve-favicon')

// 子进程
const { spawn, fork } = require('child_process')
// spawn('node', ['./script/child.js'])
// fork('./script/child.js')
// 'ping', ['www.baidu.com']
const spawnObj = spawn('node', ['./script/child.js'], { encoding: 'utf-8' })
spawnObj.stdout.on('data', function(chunk) {
  console.log('chunk: ', chunk.toString())
})
spawnObj.stderr.on('data', data => {
  console.log(data)
})
spawnObj.on('close', code => {
  console.log('close code : ' + code)
})
spawnObj.on('exit', code => {
  console.log('exit code : ' + code)
})

var session = require('express-session')
var Store = require('connect-mongo')(session)

// jwt token 认证
var jwt = require('jsonwebtoken')
var { secret } = require('./config/constant')
var jwtAuth = require('./middleware/jwt')

// passport 第三方登陆
const passport = require('passport')
const { Strategy: GithubStrategy } = require('passport-github')
const { github_client_id, github_client_secret } = require('./config/constant')

// mongoose 数据库
var mongoose = require('mongoose')

// 自定义路由
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/user')
var authRouter = require('./routes/auth')

var app = express()

// 链接mongodb
var mongodbUrl = 'mongodb://192.168.100.7/leone'
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useCreateIndex: true })
mongoose.Promise = global.Promise
mongoose.connection.on('error', e => {
  console.log('mongodb连接错误: %s', e)
})

global.To = promise => promise.then(data => [null, data]).catch(err => [err])

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
)
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// session 持久化
app.use(
  session({
    secret: 'testsessiontomongodb',
    cookie: { maxAge: 1000 * 60 * 3 },
    resave: true, // session 没修改 也保存
    saveUninitialized: false, // 未初始化 不保存
    store: new Store({
      mongooseConnection: mongoose.connection
    })
  })
)

// passport github 策略
passport.use(
  new GithubStrategy(
    {
      clientID: github_client_id,
      clientSecret: github_client_secret,
      callbackURL: '/auth/github/return'
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('github profile:', profile)
      console.log('accessToken :', accessToken)
      console.log(' refreshToken:', refreshToken)
      // 获取user
      const { id: github_id, username, profileUrl, provider } = profile
      const user = {
        github_id,
        username,
        passsword: '123456',
        profileUrl,
        provider,
        token: accessToken
      }
      console.error('github user:', user, username)
      // 可保存到store
      return done(null, user)
    }
  )
)
// 保存到 session  req.session.passport.user
passport.serializeUser((user, done) => done(null, user))
// 保存到 req.user
passport.deserializeUser((user, done) => done(null, user))
// passport 认证
app.use(passport.initialize())
app.use(passport.session())

// token 验证
app.use((req, res, next) => {
  console.error('session token ', req.session.token)
  console.error('cookie token ', req.cookies)
  console.error('req user ', req.user)
  console.error('session user ', req.session.passport)
  const token =
    req.session.token || req.cookies.token || (req.user && req.user.token)
  if (token) {
    req.body.token = token
    req.headers.authorization = 'Bearer ' + token
    res.setHeader('Authorization', 'Bearer ' + token)
  }
  next()
})
app.use(jwtAuth)
// app.use((req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers['Authorization']
//   if (token) {
//     jwt.verify(token, secret, (err, decoded) => {
//       console.error('verify: ', err, decoded)
//       next()
//     })
//   } else {
//     console.error('no token')
//     return res
//       .status(403)
//       .send({ success: false, message: 'no token provided' })
//   }
// })

app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/auth', authRouter)
app.use('/puppeteer', require('./routes/puppeteer'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
