const db = require('../config/db');

// 獲取所有用戶
exports.getAllUsers = async () => {
    const [rows] = await db.execute('select * from library.users');
    return rows;
}

// 新增用戶
exports.addUsers = async (userData) => {
    const {
        name,
        email,
        phone_number
    } = userData;
    // 檢查用戶是否已存在
    const [users] = await db.execute('select * from library.users where email = ?', [email]);
    if (users.length > 0) {
        return null;
    }
    const [result] = await db.execute('insert into library.users (name, email, phone_number) values (?, ?, ?)', [name, email, phone_number]);
    return {
        id: result.insertId,
        ...userData
    };
}

// 更新用戶
exports.updateUsers = async (id, userData) => {
    const {
        name,
        email,
        phone_number
    } = userData;
    const [result] = await db.execute('update library.users set name = ?, email = ?, phone_number = ? where id = ?', [name, email, phone_number, id]);
    return result.affectedRows > 0 ? {
        id,
        ...userData
    } : null;
}

// 刪除用戶
exports.deleteUsers = async (id, connection) => {
    try {
        // 先刪除用戶的借閱記錄
        await connection.execute('delete from library.borrows where user_id = ?', [id]);
        const [result] = await connection.execute('delete from library.users where id = ?', [id]);
        return result.affectedRows > 0;
    } catch (err) {
        throw err;
    }
}