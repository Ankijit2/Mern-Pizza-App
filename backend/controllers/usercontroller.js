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
        return {accessToken,refreshToken}
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

    const registerEmailUrl = `http://localhost:${process.env.PORT}/api/user/register/${tokenData?.user_id}/verify/${tokenData?.Token}`

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
    const TokenLink=await Token.findOne({user_id:id});
    if(!TokenLink || TokenLink.Token  !== token){
        throw new ApiError(409,'Invalid link')
    }
   
    let UserEmailVerify=await User.findById(id)
    if(!UserEmailVerify){
        throw new ApiError(400,"Acount not found")
    }

    UserEmailVerify.verified=true
    await UserEmailVerify.save({validateBeforeSave:false})
    await TokenLink.deleteOne({user_id:id})

    return res.status(201).json(
        new ApiResponse(200,null,"Account verified")
    )




 })


 const loginController =  AsyncHandler( async (req,res) =>{
    const {email,password,confirmpassword}=req.body
    if(confirmpassword!= password){
        throw new ApiError(400,'Password does not match') 
    }
    if(!email){
        throw new  ApiError(400,'Email is required')
    }
    const userLogin=await User.findOne({email:email})
    if(!userLogin){
        throw new ApiError(404,"This Email is not registered")
    }
    const isPasswordValid = await userLogin.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Incorrect Password")
    }
    const {accessToken,refreshToken}= generateTokens(userLogin._id)

    const loggedInUser = await User.findById(userLogin._id).select('-password -refreshToken')

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"Logged In Suceesfully"))
 })

const logoutController =AsyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshtoken:1
            }
        },{
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


const newtokenController = AsyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
        try{
            const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET

            )
            const user = await User.findById(decodedToken?.__id)
            if(!user){
                throw new Error(401,"Invalid refresh token")
            }
            if(user?.refreshtoken!==incomingRefreshToken){
                throw new ApiError(401,"Refresh token is expired or used")
            }
            const options={
                httpOnly:true,
                secure:true
            }
            const {accessToken,newRefreshtoken} = await generateTokens(user._id)
            
            return res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newRefreshtoken,options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken:newRefreshtoken},
                    "acessToken refreshed"
                )
            )
        }catch(error){
            throw new ApiError(491,error?.message || "Invalid refresh token")
        }
    
})

 export{registerController,emailverifyController,loginController,logoutController,newtokenController}