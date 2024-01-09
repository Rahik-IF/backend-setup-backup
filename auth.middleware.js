
// This middleware helps to judge whether valid user(token) exists or not!!

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler( async (req, _, next)=>{
  try {
    // you can get the token from two sources possible, one is may from cookies, another from header.
    // Authorization header generally bear it by bearer token. Fromat => "Beaer <token>"  
    const token = 
       req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
       if(!token){
          throw new ApiError(401, "Unauthorized request");
       }
     // verify the token.
     // But one thing you should know. Anyone can generate token, even can pass data to it.
     // But only he can decode it, who can pass the secret code!! Ha Ha Ha...nice
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const user = await User.findById(decodedToken._id).select("-password -refreshToken");
       if(!user){
          throw new ApiError(401, "Invalid Access Token");
       }
  
     // so, you know it? what does a middleware do? It can both do operations in req and res object
     // you can pass something to the req or res
     // when need to pass data for this req-res cycle, then pass it to req object, and if it need to pass into response or client, then pass into response
     req.user = user;
     next();  
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid acces token")
  }

})