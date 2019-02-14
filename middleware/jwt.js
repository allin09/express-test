const expressJWT = require('express-jwt')
const { secret } = require('../config/constant')
// express-jwt中间件帮我们自动做了token的验证以及错误处理，所以一般情况下我们按照格式书写就没问题，其中unless放的就是你想要不检验token的api。
const jwtAuth = expressJWT({ secret }).unless({
  path: [
    '/',
    '/user/login',
    '/user/register',
    '/auth/github',
    '/auth/github/return',
    '/puppeteer'
  ]
})
module.exports = jwtAuth
