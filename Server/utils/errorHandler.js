module.exports = (err, req, res, next) => {
    const {message = "Some Error Occurred" , status=500} = err;
    res.status(status).json({
        success: false,
        message: message,
    })
}