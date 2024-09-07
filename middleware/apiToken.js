const apiToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // 取得 Bearer 後的 token
        if (token === process.env.API_TOKEN) {
            return next();
        }
    }
    res.status(403).json({
        message: 'Unauthorized access'
    });
};

module.exports = apiToken;