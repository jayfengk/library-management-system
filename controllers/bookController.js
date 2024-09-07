const bookService = require('../services/bookService');
const {
    sendResponse
} = require('../utils/responseHandler');
const {
    formatDateTime,
    formatDate
} = require('../utils/formatDate');
const db = require('../config/db');

// 獲取所有書籍
const getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        books.forEach(book => {
            book.published_date = formatDate(book.published_date),
                book.created_at = formatDateTime(book.created_at),
                book.updated_at = formatDateTime(book.updated_at)
        });
        res.render('books', {
            books
        });
    } catch (err) {
        res.status(500).render('error', {
            message: 'get books failed'
        });
    }
}

// 獲取所有書籍API
const getAllBooksApi = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        books.forEach(book => {
            book.published_date = formatDate(book.published_date),
                book.created_at = formatDateTime(book.created_at),
                book.updated_at = formatDateTime(book.updated_at)
        });
        return sendResponse(res, 200, true, 'get books successfully', books);
    } catch (err) {
        return sendResponse(res, 500, false, 'get books failed', null, err);
    }
}

// 新增書籍
const addBooks = async (req, res) => {
    try {
        const {
            title,
            author,
            publisher,
            published_date
        } = req.body;
        const newBook = await bookService.addBooks({
            title,
            author,
            publisher,
            published_date
        });
        if (!newBook) {
            return res.status(400).json({
                success: false,
                message: 'book already exists'
            });
        }
        res.status(201).json({
            success: true,
            message: 'book created successfully',
            data: newBook
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'book created failed',
            error: err
        });
    }
};

// 更新書籍
const updateBooks = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            title,
            author,
            publisher,
            published_date
        } = req.body;
        const updatedBook = await bookService.updateBooks(id, {
            title,
            author,
            publisher,
            published_date
        });
        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: 'book not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'book updated successfully',
            data: updatedBook
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'book updated failed',
            error: err
        });
    }
};

// 刪除書籍
const deleteBooks = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const {
            id
        } = req.params;

        await connection.beginTransaction();
        const deletedBook = await bookService.deleteBooks(id, connection);
        if (!deletedBook) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'book not found'
            });
        }
        await connection.commit();
        res.status(200).json({
            success: true,
            message: 'book deleted successfully'
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({
            success: false,
            message: 'book deleted failed',
            error: err
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllBooks,
    getAllBooksApi,
    addBooks,
    updateBooks,
    deleteBooks
};