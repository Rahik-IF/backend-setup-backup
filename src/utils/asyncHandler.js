// handling the asynchronous functions is a very common task
// so why not make it easier by using a utility function?


//approach by promise

const asyncHandler = (requestHandler) => {
    return (req, res, next) => 
    { Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error)) }
} 
export {asyncHandler};

// approach by try catch
/*
 const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
       await requestHandler(req, res, next);      
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
} 
*/





// Higher order function
/*
1. A general function
-----------------------
const asyncHandler = ()=> {}
2. Pass another function and call it here
-------------------------------------------
const asyncHandler = (fn)=>{()=>{}}
3. Remove the curly braces
-------------------------------
const asyncHandler = (fn)=>()=>{}
4. Same thing.. just the passing funtion is a asynchronous function
----------------------------------------
const asyncHandler = (fn)=> async ()=> {}
*/