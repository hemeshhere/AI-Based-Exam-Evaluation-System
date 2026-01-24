class ApiError extends Error {

    constructor(statusCode, message, details = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        if(details){
            this.details = details;
        } 
        Error.captureStackTrace(this, this.constructor);
    }

    // Bad Request
    static BadRequest(message = 'Bad Request', details = null) {
        return new ApiError(400, message, details);
    }

    // Unauthorized access
    static Unauthorized(message = 'Unauthorized', details = null) {
        return new ApiError(401, message, details);
    }

    // Forbidden Page/Service
    static Forbidden(message = 'Forbidden', details = null) {
        return new ApiError(403, message, details);
    }

    // Page/Service not found
    static NotFound(message = 'Not Found', details = null) {
        return new ApiError(404, message, details);
    }

    // ISP Error
    static InternalServerError(message = 'Internal Server Error', details = null) {
        return new ApiError(500, message, details);
    }
}

export { ApiError };