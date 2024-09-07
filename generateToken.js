// 隨機生成的 64 字節 token
const crypto = require('crypto');
const token = crypto.randomBytes(64).toString('hex');
console.log(token);