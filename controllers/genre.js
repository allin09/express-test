const Genre = require('../models/genre')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
exports.index = async (req, res, next) => {
  let genreList = await Genre.find()
  res.render('genre_list', { title: '目录列表', genreList })
}

exports.detail = async (req, res, next) => {
  const [err, genre] = await To(Genre.findById(req.params.id))
  if (err) return next(err)
  res.render('genre_detail', { title: '类别详情', genre })
}

exports.create = async (req, res, next) => {
  res.render('genre_form', { title: '目录列表' })
}

exports.update = async (req, res, next) => {
  const [err, genre] = await To(Genre.findById(req.params.id))
  if (err) return next(err)
  res.render('genre_form', { title: '目录列表', genre })
}

exports.delete_post = async (req, res, next) => {
  const genre = req.body
  const [err, genre1] = await To(Genre.findByIdAndDelete(genre._id))
  if (err) return next(err)
  res.json(genre1)
  // res.end(null)
  // res.send(null)
  // res.status(302).send({ status: 200, message: 'ok', data: [1, 2, 3] })
}

exports.create_post = [
  body('name', 'name必须输入')
    .isLength({ min: 2 })
    .trim(),
  sanitizeBody('name')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('genre_form', {
        title: 'save error',
        genre: { name: req.body.name },
        errors: errors.array()
      })
    }
    const genre = new Genre({
      name: req.body.name
    })
    const [err, data] = await To(Genre.findOne({ name: req.body.name }))
    if (err) return next(err)
    if (data) {
      return res.redirect(data.url)
    }
    genre.save((err, data) => {
      if (err) return next(err)
      res.redirect(data.url)
    })
  }
]

exports.update_post = [
  body('name', 'name必须输入')
    .isLength({ min: 2 })
    .trim(),
  sanitizeBody('name')
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('genre_form', {
        title: 'update error',
        genre: { name: req.body.name },
        errors: errors.array()
      })
    }
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id
    })
    const [err, data] = await To(Genre.findById(req.params.id))
    if (err) return next(err)
    if (data) {
      const [err2, newGenre] = await To(
        Genre.findByIdAndUpdate(req.params.id, genre, {})
      )
      if (err2) return next(err2)
      return res.redirect(newGenre.url)
    }
    genre.save((err, data) => {
      if (err) return next(err)
      res.redirect(data.url)
    })
  }
]
