const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/constant')

class UserController {
  constructor() {}
  async register(req, res, next) {
    console.error('cookies: ', req.cookies)
    console.error('session: ', req.session)

    const oneUser = new User(req.body)
    const [err, hasUser] = await To(
      User.findOne({ username: oneUser.username })
    )
    if (err) return next(err)
    console.error('hasUser: ', hasUser)
    if (hasUser) {
      return await hasUser.comparePassword(oneUser.password, (err, isMatch) => {
        console.error('isMatch: ', isMatch, err)
        if (err) return next(err)
        return res.json({ data: '已被注册了', isMatch })
      })
    }
    const { id, username } = await oneUser.save()
    console.error('savedUser: ', id, username)
    const token = jwt.sign({ id, username }, secret, { expiresIn: 60 * 3 }) // 单位秒
    req.session.token = token
    res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 3 })
    res.cookie('token1', token, { httpOnly: true, maxAge: 1000 * 60 * 3 })
    res.setHeader('Authorization', 'Bearer ' + token)
    res.json({ token })
  }

  async login(req, res, next) {
    const oneUser = new User(req.body)
    const [err, hasUser] = await To(
      User.findOne({ username: oneUser.username })
    )
    if (err) return next(err)
    if (hasUser) {
      return await hasUser.comparePassword(oneUser.password, (err, isMatch) => {
        if (err) return next(err)
        if (!isMatch) return res.json({ msg: '密码错误' })
        const { id, username } = hasUser
        const token = jwt.sign({ id, username }, secret, { expiresIn: 60 * 3 })
        req.session.token = token
        return res.json({ msg: '登陆成功', token })
      })
    }
    return res.json({ msg: '账号不存在' })
  }
}

module.exports = new UserController()
