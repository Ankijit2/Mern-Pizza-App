import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Order} from '../models/ordermodel.js'
import {Pizza} from '../models/pizzamodel.js'
import { fileUpload } from "../utils/cloudinary.js";

const adminloginCOntroller = AsyncHandler(async (req, res) => {
    const adminemail = process.env.ADMIN_EMAIL
    const adminpassword = process.env.ADMIN_PASSWORD
    const { email, password } = req.body;

    if (email !== adminemail || password !== adminpassword) {
        throw new ApiError(401, "Invalid Credentials");
    }
    res.status(200).send("admin logged in successfully");
    
})

const allordercontroller = AsyncHandler(async(req,res)=>{
    const orders = await Order.find({})
    if(!orders){
        throw new ApiError(404,"No order found")
    }
    res.status(200).json(new ApiResponse(200,orders,"all orders"))
})

const addpizzacontroller = AsyncHandler(async(req,res)=>{
  const {name,description,price} = req.body
  if([name,description,price].some((field)=>field?.trim()==='')){
    throw new ApiError(400,"All fields are required")
  }
  const pizzaimage = req.file?.pizzaimage[0]?.path;
  if(!pizzaimage){
    throw new ApiError(400,"Image is required")
  }
  const image = await fileUpload(pizzaimage)

  const pizza = await Pizza.create({
    name,
    description,
    image,
    price
  })
  res.status(200).json(new ApiResponse(200,pizza,"pizza created successfully"))


})

export {adminloginCOntroller,allordercontroller,addpizzacontroller}