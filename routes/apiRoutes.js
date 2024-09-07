const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const borrowController = require('../controllers/borrowController');
const apiToken = require('../middleware/apiToken');

// 用戶 API
router.get('/users', apiToken, userController.getAllUsersApi);

// 書籍 API
router.get('/books', apiToken, bookController.getAllBooksApi);

// 借閱紀錄 API
router.get('/borrows', apiToken, borrowController.getAllBorrowsApi);
router.post('/borrows', apiToken, borrowController.addBorrowsApi);
router.put('/borrows/:id', apiToken, borrowController.updateBorrowsApi);
router.delete('/borrows/:id', apiToken, borrowController.deleteBorrowsApi);

module.exports = router;