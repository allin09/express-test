var express = require('express')
var router = express.Router()
const user_controller = require('../controllers/user')

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login')
})
router.get('/register', function(req, res, next) {
  res.render('register')
})

// 注册
router.post('/register', user_controller.register)
router.post('/login', user_controller.login)

module.exports = router
