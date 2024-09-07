const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const userController = require('../controllers/userController');
const borrowController = require('../controllers/borrowController');

// 首頁
router.get('/', (req, res) => {
    res.render('index');
})

// 書籍
router.get('/books', bookController.getAllBooks);
router.post('/books', bookController.addBooks);
router.put('/books/:id', bookController.updateBooks);
router.delete('/books/:id', bookController.deleteBooks);

// 用戶
router.get('/users', userController.getAllUsers);
router.post('/users', userController.addUsers);
router.put('/users/:id', userController.updateUsers);
router.delete('/users/:id', userController.deleteUsers);

// 借閱紀錄
router.get('/borrows', borrowController.getAllBorrows);

module.exports = router;