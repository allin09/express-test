const mongoose = require('mongoose')
const Schema = mongoose.Schema
let bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 100
  },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: 'Author', required: true },
  genre: [{ type: Schema.ObjectId, ref: 'Genre' }]
})

bookSchema.virtual('url').get(function() {
  return '/book/' + this.id
})

module.exports = mongoose.model('Book', bookSchema)
