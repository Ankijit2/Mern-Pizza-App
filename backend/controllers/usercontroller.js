import mongoose from "mongoose";
import crypto from "crypto";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/usermodel.js";
import {Order} from "../models/ordermodel.js"
import { Token } from "../models/Tokenmodel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import jwt from "jsonwebtoken";
import { EmailSend } from "../utils/emailSender.js";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerController = AsyncHandler(async (req, res) => {
  const { fullname, username, email, password, confirmpassword } = req.body;
  if (
    [fullname, username, email, password, confirmpassword].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Fill all fields");
  }
  if (password != confirmpassword) {
    throw new ApiError(400, "Password does not match");
  }

  if (
    [fullname, username, email, password, confirmpassword].some(
      (field) => field === undefined
    )
  ) {
    throw new ApiError(400, "undefined fields");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create account");
  }
  const GeneratedToken = crypto.randomBytes(32).toString("hex");

  const tokenData = await Token.create({
    user_id: user._id,
    Token: GeneratedToken,
  });

  if (!tokenData) {
    throw new ApiError(500, "Failed to generate token");
  }

  const registerEmailUrl = `http://localhost:${process.env.PORT}/api/user/register/${tokenData?.user_id}/verify/${tokenData?.Token}`;

  const Verificationmail = await EmailSend(
    user.email,
    "Verification Link",
    `click to verify ${registerEmailUrl}`
  );
  if (!Verificationmail) {
    throw new ApiError(500, "Something went wrong while sending OTP");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "Account has been created successfully!"
      )
    );
});

const emailverifyController = AsyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const TokenLink = await Token.findOne({ user_id: id });
  if (!TokenLink || TokenLink.Token !== token) {
    throw new ApiError(409, "Invalid link");
  }

  let UserEmailVerify = await User.findById(id);
  if (!UserEmailVerify) {
    throw new ApiError(400, "Acount not found");
  }

  UserEmailVerify.verified = true;
  await UserEmailVerify.save({ validateBeforeSave: false });
  await TokenLink.deleteOne({ user_id: id });

  return res.status(201).json(new ApiResponse(200, null, "Account verified"));
});

const loginController = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const userLogin = await User.findOne({ email: email });
  if (!userLogin) {
    throw new ApiError(404, "This Email is not registered");
  }
  const isPasswordValid = await userLogin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password");
  }
  const { accessToken, refreshToken } = await generateTokens(userLogin._id);
  console.log(accessToken, refreshToken);

  const loggedInUser = await User.findById(userLogin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Logged In Suceesfully"
      )
    );
});

const logoutController = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshtoken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log(refreshToken);
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const newtokenController = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?.__id);
    if (!user) {
      throw new Error(401, "Invalid refresh token");
    }
    if (user?.refreshtoken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshtoken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshtoken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshtoken },
          "acessToken refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(491, error?.message || "Invalid refresh token");
  }
});
const forgotpassowrdController = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const GeneratedToken = crypto.randomBytes(32).toString("hex");

  const tokenData = await Token.create({
    user_id: user._id,
    Token: GeneratedToken,
  });

  if (!tokenData) {
    throw new ApiError(500, "Failed to generate token");
  }
  const url = `http://localhost:${process.env.PORT}/api/user/resetpassword/${user._id}/verify/${GeneratedToken}`;
  await EmailSend(
    email,
    "Password Reset Request",
    `<a href=${url}>Click here to reset your password</a>`
  );
  return res.staus(200).json(new ApiResponse(200, {}, "Password reset link sent to your email"));
});

const forgotpassowrdverificationController = AsyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const tokenuser = await Token.findOne({ user_id: id });
  if (!tokenuser || tokenuser?.Token !== token) {
    throw new ApiError(404, "Invalid link");
  }
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { password, confirmpassword } = req.body;
  if (password !== confirmpassword) {
    throw new ApiError(400, "Password does not match");
  }
  user.password = password;
  await user.save();
  await tokenuser.remove();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const userOrderController = AsyncHandler(async(req,res)=>{
  const {username} = req.params
  const userOrderdata = User.aggregate([
    {
      $match:{
        username
      }
    },
    {
      $lookup:{
        from: "orders",
        localField:"_id",
        foreignField:"user_id",
        as:"orders"

    }}
  ])

  return res.status(200).json(new ApiResponse(200,{userOrderdata},"user order data"))

})


export {
  registerController,
  emailverifyController,
  loginController,
  logoutController,
  newtokenController,
  forgotpassowrdController,
  forgotpassowrdverificationController,
  userOrderController
};
