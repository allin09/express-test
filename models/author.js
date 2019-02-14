const mongoose = require('mongoose')
const dayjs = require('dayjs')
const Schema = mongoose.Schema
let authorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100
  },
  family_name: {
    type: String,
    require: true,
    max: 100
  },
  age: { type: Number },
  birth: { type: Date }
})

authorSchema.virtual('name').get(function() {
  return this.family_name + ' ' + this.first_name
})

authorSchema.virtual('url').get(function() {
  return '/author/' + this._id
})

authorSchema.virtual('birthDay').get(function() {
  return dayjs(this.birth).format('YYYY-MM-DD')
})

module.exports = mongoose.model('Author', authorSchema)
