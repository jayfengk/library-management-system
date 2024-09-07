// API response
const sendResponse = (res, status, success, message, data = null, error = null) => {
    const response = {
        success,
        message,
    };
    if (data) {
        response.data = data;
    }
    if (error) {
        response.error = error;
    }
    res.status(status).json(response);
};

module.exports = {
    sendResponse
};