class ApiError extends Error{

    constructor(statusCode, message, errors=null, isOperational= true){

        super(message);
        this.statusCode= statusCode;
        this.errors= errors;
        this.isOperational= isOperational;
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message= "Bed Request", errors= null){

        return new ApiError(400,message,errors)
    }

    static unauthorized(message= "Unauthorized"){

        return new ApiError(401,message);
    }

    static forbidden(message= "Forbidden"){

        return new ApiError(403, message);

    }

    static notFound(message= "Not Found"){

        return new ApiError(404, message);

    }

    static conflict(message="Already Exist"){

        return new ApiError(409, message);
    }

    static tooManyRequests(message= "Too Many Requests"){

        return new ApiError(429, message)
    }

    static internal(message= "Internal Server Error"){

        return new ApiError(500, message);
    }
}

module.exports= ApiError;