var express = require('express')
var router = express.Router()
const passport = require('passport')
/* GET auth listing. */
router.get(
  '/github',
  passport.authenticate('github', {
    failureRedirect: '/user/login'
  })
)
router.get(
  '/github/return',
  passport.authenticate('github', {
    failureRedirect: '/user/login'
  }),
  (req, res) => {
    res.redirect('/')
  }
)

module.exports = router
