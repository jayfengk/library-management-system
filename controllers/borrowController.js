const borrowService = require('../services/borrowService');
const {
    sendResponse
} = require('../utils/responseHandler');
const {
    formatDateTime,
    formatDate
} = require('../utils/formatDate');

// 獲取節有借閱記錄
const getAllBorrows = async (req, res) => {
    try {
        const borrows = await borrowService.getAllBorrows();
        borrows.forEach(borrow => {
            borrow.borrow_date = formatDate(borrow.borrow_date);
            borrow.return_date = borrow.return_date ? formatDate(borrow.return_date) : null;
            borrow.created_at = formatDateTime(borrow.created_at);
            borrow.updated_at = formatDateTime(borrow.updated_at);
        })
        res.render('borrows', {
            borrows
        });
    } catch (err) {
        res.status(500).render('error', {
            message: 'get borrows failed',
            error: err
        });
    }
};

// 獲取所有借閱記錄API
const getAllBorrowsApi = async (req, res) => {
    try {
        const borrows = await borrowService.getAllBorrows();
        console.log(borrows);
        borrows.forEach(borrow => {
            borrow.borrow_date = formatDate(borrow.borrow_date);
            borrow.return_date = borrow.return_date ? formatDate(borrow.return_date) : null;
            borrow.created_at = formatDateTime(borrow.created_at);
            borrow.updated_at = formatDateTime(borrow.updated_at);
        })
        return sendResponse(res, 200, true, 'get borrows successfully', borrows);
        res.render('borrows', {
            borrows
        });
    } catch (err) {
        return sendResponse(res, 500, false, 'get borrows failed', null, err);
    }
};

// 新增借閱記錄
const addBorrowsApi = async (req, res) => {
    try {
        const {
            user_id,
            book_id,
            borrow_date,
            return_date
        } = req.body;
        const newBorrow = await borrowService.addBorrows({
            user_id,
            book_id,
            borrow_date,
            return_date
        });
        switch (newBorrow) {
            case 'user':
                return sendResponse(res, 400, false, 'user not found');
            case 'book':
                return sendResponse(res, 400, false, 'book not found');
            case 'borrowed':
                return sendResponse(res, 400, false, 'book already borrowed');
            default:
                sendResponse(res, 201, true, 'borrow created successfully', newBorrow);
        }
    } catch (err) {
        sendResponse(res, 500, false, 'borrow created failed', null, err);
    }
};

// 更新借閱記錄
const updateBorrowsApi = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            user_id,
            book_id,
            borrow_date,
            return_date
        } = req.body;
        const updatedBorrow = await borrowService.updateBorrows(id, {
            user_id,
            book_id,
            borrow_date,
            return_date
        });
        switch (updatedBorrow) {
            case 'user':
                return sendResponse(res, 400, false, 'user not found');
            case 'book':
                return sendResponse(res, 400, false, 'book not found');
            case 'borrowed':
                return sendResponse(res, 400, false, 'book already borrowed');
            default:
                sendResponse(res, 200, true, 'borrow updated successfully', updatedBorrow);
        }
    } catch (err) {
        sendResponse(res, 500, false, 'borrow updated failed', null, err);
    }
}

// 刪除借閱記錄
const deleteBorrowsApi = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const result = await borrowService.deleteBorrows(id);
        if (result) {
            sendResponse(res, 200, true, 'borrow deleted successfully');
        } else {
            sendResponse(res, 404, false, 'borrow not found');
        }
    } catch (err) {
        sendResponse(res, 500, false, 'borrow deleted failed', null, err);
    }
}

module.exports = {
    getAllBorrows,
    getAllBorrowsApi,
    addBorrowsApi,
    updateBorrowsApi,
    deleteBorrowsApi
}