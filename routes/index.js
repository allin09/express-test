var express = require('express')
var router = express.Router()
var index_controller = require('../controllers/index')
var genre_controller = require('../controllers/genre')
var author_controller = require('../controllers/author')
const book_controller = require('../controllers/book')
const bookInstance_controller = require('../controllers/bookInstance')

/* GET home page. */
router.get('/', index_controller.index)

// 类型
router.get('/genre', genre_controller.index)
router.get('/genre/create', genre_controller.create)
router.post('/genre/create', genre_controller.create_post)
router.get('/genre/:id', genre_controller.detail)
router.get('/genre/:id/update', genre_controller.update)
router.post('/genre/:id/update', genre_controller.update_post)
router.post('/genre/:id/delete', genre_controller.delete_post)

// 作者
router.get('/author', author_controller.index)
router.get('/author/create', author_controller.create)
router.post('/author/create', author_controller.create_post)
router.get('/author/:id', author_controller.detail)
router.get('/author/:id/update', author_controller.update)
router.post('/author/:id/update', author_controller.update_post)
router.post('/author/:id/delete', author_controller.delete_post)

// 书
router.get('/book', book_controller.index)
router.get('/book/create', book_controller.create)
router.post('/book/create', book_controller.create_post)
router.get('/book/:id', book_controller.detail)
router.get('/book/:id/update', book_controller.update)
router.post('/book/:id/update', book_controller.update_post)
router.post('/book/:id/delete', book_controller.delete_post)

// 书实例
router.get('/bookInstance', bookInstance_controller.index)
router.get('/bookInstance/create', bookInstance_controller.create)
router.post('/bookInstance/create', bookInstance_controller.create_post)
router.get('/bookInstance/:id', bookInstance_controller.detail)
router.get('/bookInstance/:id/update', bookInstance_controller.update)
router.post('/bookInstance/:id/update', bookInstance_controller.update_post)
router.post('/bookInstance/:id/delete', bookInstance_controller.delete_post)

module.exports = router
