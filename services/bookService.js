const db = require('../config/db');

// 獲取所有書籍
exports.getAllBooks = async () => {
    const [rows] = await db.execute('select * from library.books');
    return rows;
}

// 新增書籍
exports.addBooks = async (bookData) => {
    const {
        title,
        author,
        publisher,
        published_date
    } = bookData;
    // 檢查書籍是否已存在
    const [books] = await db.execute('select * from library.books where title = ? and author = ?', [title, author]);
    if (books.length > 0) {
        return null;
    }
    const [result] = await db.execute('insert into library.books (title, author, publisher, published_date) values (?, ?, ?, ?)', [title, author, publisher, published_date]);
    return {
        id: result.insertId,
        ...bookData
    };
}

// 更新書籍
exports.updateBooks = async (id, bookData) => {
    const {
        title,
        author,
        publisher,
        published_date
    } = bookData;
    const [result] = await db.execute('update library.books set title = ?, author = ?, publisher = ?, published_date = ? where id = ?', [title, author, publisher, published_date, id]);
    return result.affectedRows > 0 ? {
        id,
        ...bookData
    } : null;
}

// 刪除書籍
exports.deleteBooks = async (id, connection) => {
    try {
        // 先刪除書籍的借閱記錄
        await connection.execute('delete from library.borrows where book_id = ?', [id]);
        const [result] = await connection.execute('delete from library.books where id = ?', [id]);
        return result.affectedRows > 0;
    } catch (err) {
        throw err;
    }
}