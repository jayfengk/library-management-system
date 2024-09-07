const userService = require('../services/userService');
const {
    sendResponse
} = require('../utils/responseHandler');
const {
    formatDateTime
} = require('../utils/formatDate');
const db = require('../config/db');

// 獲取所有用戶
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        users.forEach(user => {
            user.created_at = formatDateTime(user.created_at);
            user.updated_at = formatDateTime(user.updated_at);
        });
        res.render('users', {
            users
        });
    } catch (err) {
        res.status(500).render('error', {
            message: 'get users failed',
            error: err
        });
    }
};

// 獲取所有用戶API
const getAllUsersApi = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        users.forEach(user => {
            user.created_at = formatDateTime(user.created_at);
            user.updated_at = formatDateTime(user.updated_at);
        });
        return sendResponse(res, 200, true, 'get users successfully', users);
    } catch (err) {
        return sendResponse(res, 500, false, 'get users failed', null, err);
    }
};

// 新增用戶
const addUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            phone_number
        } = req.body;
        const newUser = await userService.addUsers({
            name,
            email,
            phone_number
        });

        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: 'user already exists',
            });
        }
        res.status(201).json({
            success: true,
            message: 'user created successfully',
            data: newUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'user created failed',
            error: err
        });
    }
};

// 更新用戶
const updateUsers = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            name,
            email,
            phone_number
        } = req.body;
        const updatedUser = await userService.updateUsers(id, {
            name,
            email,
            phone_number
        });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'user updated successfully',
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'user update failed',
            error: err
        });
    }
};

// 刪除用戶
const deleteUsers = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const {
            id
        } = req.params;
        await connection.beginTransaction();
        const deletedUser = await userService.deleteUsers(id, connection);

        if (!deletedUser) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'user not found'
            });
        }
        await connection.commit();
        res.status(200).json({
            success: true,
            message: 'user deleted successfully'
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({
            success: false,
            message: 'user deletion failed',
            error: err
        });
    } finally {
        connection.release();
    }
};


module.exports = {
    getAllUsers,
    getAllUsersApi,
    addUsers,
    updateUsers,
    deleteUsers
};