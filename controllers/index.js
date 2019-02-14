const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/constant')

exports.index = async (req, res, next) => {
  // let count = await Genre.count()
  // let count = await Genre.countDocuments()
  const token = req.session.token
  if (token) {
    return jwt.verify(token, secret, async (err, { id }) => {
      if (id) {
        const user = await User.findById(id)
        return res.render('member', { title: '个人中心', user })
      }
    })
  }
  res.render('login', { title: 'login' })
}
