import mongoose,{Schema} from "mongoose";


const otpSchema = new Schema({
    email:{
        type:Schema.Types.ObjectId,
        ref:"User",
        index:true,
        unique:true
    },
    OTP:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 3600,
    },

})

otpSchema.pre('save',async function(next){
    this.OTP = await bcrypt.hash(this.OTP,10)
    next()
})

otpSchema.methods.isOtpCorrect = async function(OTP){
    return await bcrypt.compare(OTP,this.OTP)
}

export const OTP = mongoose.model('OTP',otpSchema)