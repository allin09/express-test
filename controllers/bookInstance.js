const BookInstance = require('../models/bookInstance')
const Book = require('../models/book')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
exports.index = async (req, res, next) => {
  let bookInstanceList = await BookInstance.find().populate('book')
  res.render('bookInstance_list', {
    title: '书籍列表',
    bookInstanceList
  })
}

exports.detail = async (req, res, next) => {
  const [err, bookInstance] = await To(BookInstance.findById(req.params.id))
  if (err) return next(err)
  res.render('bookInstance_detail', { title: '书籍实例', bookInstance })
}

exports.create = async (req, res, next) => {
  const [err, books] = await To(Book.find())
  const status = ['Available', 'Maintenance', 'Loaned', 'Reserved']
  res.render('bookInstance_form', { title: '添加书籍实例', books, status })
}

exports.update = async (req, res, next) => {
  const [err, bookInstance] = await To(BookInstance.findById(req.params.id))
  if (err) return next(err)
  res.render('bookInstance_form', { title: '修改书籍', bookInstance })
}

exports.delete_post = async (req, res, next) => {
  const bookInstance = req.body
  const [err, bookInstance2] = await To(
    BookInstance.findByIdAndDelete(bookInstance._id)
  )
  if (err) return next(err)
  if (!bookInstance2) return res.json({ msg: '已经删除了' })
  res.json(bookInstance2)
}

exports.create_post = [
  body('book', 'book field is required!')
    .isLength({ min: 2 })
    .trim(),
  body('imprint', 'imprint field is required!')
    .isLength({ min: 2 })
    .trim(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),
  sanitizeBody('*')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('bookInstance_form', {
        title: 'save error',
        BookInstance: req.body,
        errors: errors.array()
      })
    }
    const { book, imprint, due_back, status } = req.body
    const bookInstance = new BookInstance({
      book,
      imprint,
      due_back,
      status
    })

    bookInstance.save((err, data) => {
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
