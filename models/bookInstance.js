const mongoose = require('mongoose')
const dayjs = require('dayjs')
const Schema = mongoose.Schema
const bookModel = require('./book')
let bookInstanceSchema = new Schema({
  imprint: {
    type: String,
    required: true,
    min: 3,
    max: 100
  },
  due_back: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance'
  },
  book: { type: Schema.ObjectId, ref: 'Book', required: true }
})

bookInstanceSchema.virtual('url').get(function() {
  return '/bookInstance/' + this._id
})

bookInstanceSchema.virtual('date').get(function() {
  return dayjs(this.due_back).format('YYYY-MM-DD')
})

bookInstanceSchema.virtual('bookName').get(async function() {
  const book = await bookModel.findById(this.book)
  console.error(book.title)
  return book.title
})

module.exports = mongoose.model('BookInstance', bookInstanceSchema)
