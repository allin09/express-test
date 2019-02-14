const Book = require('../models/book')
const Author = require('../models/author')
const Genre = require('../models/genre')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
exports.index = async (req, res, next) => {
  let bookList = await Book.find()
    .populate('genre')
    .populate('author')
  res.render('book_list', { title: '作者', bookList })
}

exports.detail = async (req, res, next) => {
  const [err, book] = await To(Book.findById(req.params.id))
  if (err) return next(err)
  res.render('book_detail', { title: '书名详情', book })
}

exports.create = async (req, res, next) => {
  const [authors, genres] = [await Author.find(), await Genre.find()]
  res.render('book_form', { title: '添加书类', genres, authors })
}

exports.update = async (req, res, next) => {
  const [authors, genres] = [await Author.find(), await Genre.find()]
  const [err, book] = await To(Book.findById(req.params.id))
  if (err) return next(err)
  res.render('book_form', { title: '修改书名', book, authors, genres })
}

exports.delete_post = async (req, res, next) => {
  const author = req.body
  const [err, author2] = await To(Author.findByIdAndDelete(author._id))
  if (err) return next(err)
  if (!author2) return res.json({ msg: '已经删除了' })
  res.json(author2)
}

exports.create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array))
      req.body.genre = new Array(req.body.genre).filter(el => el)
    console.error(req.body)
    next()
  },
  body(['title', 'summary'], '标题，简介必须输入')
    .isLength({ min: 2 })
    .trim(),
  sanitizeBody('*')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('book_form', {
        title: 'save error',
        book: req.body,
        errors: errors.array()
      })
    }
    const { title, summary, isbn, author, genre } = req.body
    const book = new Book({
      title,
      summary,
      isbn,
      author,
      genre
    })
    const [err, data] = await To(
      Book.findOne({
        title
      })
    )
    if (err) return next(err)
    if (data) {
      return res.redirect(data.url)
    }
    book.save((err, data) => {
      if (err) return next(err)
      res.redirect(data.url)
    })
  }
]

exports.update_post = [
  body('first_name', 'name必须输入')
    .isLength({ min: 2 })
    .trim(),
  sanitizeBody('first_name')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('author_form', {
        title: 'update error',
        author: req.body,
        errors: errors.array()
      })
    }
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      birth: req.body.birth,
      age: req.body.age,
      _id: req.params.id
    })
    const [err, data] = await To(Author.findById(req.params.id))
    if (err) return next(err)
    if (data) {
      const [err2, newAuthor] = await To(
        Author.findByIdAndUpdate(req.params.id, author, {})
      )
      if (err2) return next(err2)
      return res.redirect(newAuthor.url)
    }
    author.save((err, data) => {
      if (err) return next(err)
      res.redirect(data.url)
    })
  }
]
