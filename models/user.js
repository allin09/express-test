const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10
let userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    min: 3,
    max: 100
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 100
  },
  salt: String,
  hash: String
})

userSchema.virtual('psd').get(function() {
  const { password, salt, hash } = this
  return password + '---' + salt + hash
})

userSchema.methods.comparePassword = function(candidate, callback) {
  console.error('comparePassword: ', this)
  bcrypt.compare(candidate, this.hash, (err, isMatch) => callback(err, isMatch))
}

userSchema.statics.comparePassword2 = async function(candidate, callback) {
  const oneUser = await this.findOne({ password: candidate })
  console.error('comparePassword2: ', oneUser)
  bcrypt.compare(candidate, oneUser.hash, (err, isMatch) =>
    callback(err, isMatch)
  )
}

userSchema.pre('save', function(next) {
  console.error('pre save --------', this)
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) return next(err)
      this.salt = salt
      this.hash = hash
      next()
    })
  })
})

userSchema.post('save', function(doc) {
  console.error('post save --------', this)
  console.error('post save --------', doc)
})

module.exports = mongoose.model('User', userSchema)
