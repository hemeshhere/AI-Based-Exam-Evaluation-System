class ApiResponse {

    constructor(res) {
        this.res = res;
    }

    // Success
    success(statusCode, data, message = 'Success') {
        this.res.status(statusCode).json({
            status: 'success',
            message,
            data
        });
    }

    // Error
    error(error) {
        this.res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Internal Server Error',
            details: error.details || null
        });
    }
}

export { ApiResponse };