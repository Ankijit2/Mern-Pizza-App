import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("mongoDb connected : ",connect.connection.host)
    }catch(error){
        console.log("error :",error)
    }
}

export {connectDB}