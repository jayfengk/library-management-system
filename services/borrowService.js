const db = require('../config/db');

// 獲取所有借閱記錄
exports.getAllBorrows = async () => {
    const [rows] = await db.execute('select users.name, books.title, borrows.* from library.borrows join library.users on borrows.user_id = users.id join library.books on borrows.book_id = books.id');
    return rows;
}

// 新增借閱記錄
exports.addBorrows = async (borrorData) => {
    const {
        user_id,
        book_id,
        borrow_date,
        return_date
    } = borrorData;
    // 檢查用戶是否存在
    const [users] = await db.execute('select * from library.users where id = ?', [user_id]);
    if (users.length === 0) {
        return 'user';
    }
    // 檢查書籍是否存在
    const [books] = await db.execute('select * from library.books where id = ?', [book_id]);
    if (books.length === 0) {
        return 'book';
    }
    // 檢查書籍是否已被借閱
    const [borrows] = await db.execute('select * from library.borrows where book_id = ? and return_date is null', [book_id]);
    if (borrows.length > 0) {
        return 'borrowed';
    }
    const [result] = await db.execute('insert into library.borrows (user_id, book_id, borrow_date, return_date) values (?, ?, ?, ?)', [user_id, book_id, borrow_date, return_date]);
    return {
        id: result.insertId,
        ...borrorData
    };
}

// 更新借閱記錄
exports.updateBorrows = async (id, borrorData) => {
    const {
        user_id,
        book_id,
        borrow_date,
        return_date
    } = borrorData;
    // 檢查用戶是否存在
    const [users] = await db.execute('select * from library.users where id = ?', [user_id]);
    if (users.length === 0) {
        return 'user';
    }
    // 檢查書籍是否存在
    const [books] = await db.execute('select * from library.books where id = ?', [book_id]);
    if (books.length === 0) {
        return 'book';
    }
    // 檢查書籍是否已被借閱
    const [borrows] = await db.execute('select * from library.borrows where book_id = ? and return_date is null and id != ?', [book_id, id]);
    if (borrows.length > 0) {
        return 'borrowed';
    }
    const [result] = await db.execute('update library.borrows set user_id = ?, book_id = ?, borrow_date = ?, return_date = ? where id = ?', [user_id, book_id, borrow_date, return_date, id]);
    return result.affectedRows > 0 ? {
        id,
        ...borrorData
    } : null;
}

// 刪除借閱記錄
exports.deleteBorrows = async (id) => {
    const [result] = await db.execute('delete from library.borrows where id = ?', [id]);
    return result.affectedRows > 0;
}