import mongoose from "mongoose";
import crypto from "crypto";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/usermodel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Token } from "../models/Tokenmodel.js";
// import  jwt from 'jsonwebtoken';
import { EmailSend } from "../utils/emailSender.js";


 const generateTokens = async(userId)=>{
    try{
        const user = User.findById(userId);
        const acessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {acessToken,refreshToken}
    }catch(error){
        throw new ApiError(500,"Something went wrong generating tokens")
    }
 }

 const registerController = AsyncHandler(async(req,res)=>{
    const {fullname,username,email,password,confirmpassword}=req.body
    if(password!=confirmpassword){ 
        throw new ApiError(400,'Password does not match')
    }

    if([fullname,username,email,password,confirmpassword].some((field)=>field?.trim()==="")){
        throw new ApiError(400,'Fill all fields')
    }
    if([fullname,username,email,password,confirmpassword].some((field)=>field===undefined)){
        throw new ApiError(400,'undefined fields')
    }

    const existedUser = await User.findOne({$or:[{username},{email}]});

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    const user = await User.create({
        fullname,
        username:username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Failed to create account")
    }
    const GeneratedToken =  crypto.randomBytes(32).toString('hex')

    const tokenData = await  Token.create({
        user_id : user._id ,
        Token : GeneratedToken,
     })

     if(!tokenData){
        throw new  ApiError(500,"Failed to generate token")
     }

    const registerEmailUrl = `http://localhost:${process.env.PORT}/api/user/${tokenData?.user_id}/verify/${tokenData?.Token}`

    const Verificationmail= await EmailSend(user.email, "Verification Link", `click to verify ${registerEmailUrl}`);
    if(!Verificationmail){
        throw new ApiError(500,"Something went wrong while sending OTP")
    }

 
  


    return res.status(201).json(
        new ApiResponse(200,createdUser,"Account has been created successfully!")
    )
 })



 const emailverifyController = AsyncHandler(async(req,res)=>{
    const {id,token}=req.params
    const user=await Token.find(id)
 })

 export{registerController}