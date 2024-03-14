import mongoose,{Schema} from "mongoose";


const TokenSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        index:true,
        unique:true
    },
    Token:{
        type:String,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 3600,
    },

})



export const Token = mongoose.model('Token',TokenSchema)