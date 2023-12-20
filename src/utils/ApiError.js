// Error is a class of JS where many types of errors are available
// So we can use it and extend it with our requirements
// read here https://nodejs.org/api/errors.html

class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something is wrong",
        errors = [],
        stack = ""
    ){
         // message must be overWrite
         super(message);
         this.statusCode = statusCode;
         this.data = null;
         this.message = message;
         this.success = false;
         this.errors = errors;

         if(stack){
            this.stack = stack;
         }else{
            Error.captureStackTrace(this, this.constructor);
         }
    }
}

export {ApiError};