const Author = require('../models/author')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
exports.index = async (req, res, next) => {
  let authorList = await Author.find()
  res.render('author_list', { title: '作者', authorList })
}

exports.detail = async (req, res, next) => {
  const [err, author] = await To(Author.findById(req.params.id))
  if (err) return next(err)
  res.render('author_detail', { title: '作者详情', author })
}

exports.create = async (req, res, next) => {
  res.render('author_form', { title: '添加作者' })
}

exports.update = async (req, res, next) => {
  const [err, author] = await To(Author.findById(req.params.id))
  if (err) return next(err)
  res.render('author_form', { title: '修改作者', author })
}

exports.delete_post = async (req, res, next) => {
  const author = req.body
  const [err, author2] = await To(Author.findByIdAndDelete(author._id))
  if (err) return next(err)
  if (!author2) return res.json({ msg: '已经删除了' })
  res.json(author2)
  // res.end(null)
  // res.send(null)
  // res.status(302).send({ status: 200, message: 'ok', data: [1, 2, 3] })
}

exports.create_post = [
  body(['first_name', 'family_name'], 'name必须输入')
    .isLength({ min: 2 })
    .trim(),
  sanitizeBody('first_name')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('author_form', {
        title: 'save error',
        author: req.body,
        errors: errors.array()
      })
    }
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      birth: req.body.birth,
      age: req.body.age
    })
    const [err, data] = await To(
      Author.findOne({
        first_name: req.body.first_name,
        family_name: req.body.family_name
      })
    )
    if (err) return next(err)
    if (data) {
      return res.redirect(data.url)
    }
    author.save((err, data) => {
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
