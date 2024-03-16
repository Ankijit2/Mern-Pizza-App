import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import  jwt from "jsonwebtoken";
import { User } from "../models/usermodel.js";

export const verifyJWT = AsyncHandler(async(req,res,next)=>{
   try {
     const token =req.cokkies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     console.log(token)
     if(!token){
         throw new ApiError(401,"unauthorized request")
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("_password -refreshToken")
 
     if(!user){
         throw new ApiError(401,"Invalid Acesss Token")
     }
     req.user = user;
     next();
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
   }
})