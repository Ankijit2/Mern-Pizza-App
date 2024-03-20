import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,  
        ref:"User",
        required:true,
    },
  
    Custompizza:[
        {
            base:{
                type:Schema.Types.ObjectId,
                ref:'Ingredient',
                required:true,
            },
            sauce:{
                type:Schema.Types.ObjectId,
                ref:'Ingredient',
                required:true

            },
            cheese:{
                type:Schema.Types.ObjectId,
                ref:'Ingredient',
                required:true
            },
            veggies:[
                {
                    type:Schema.Types.ObjectId,
                    ref:'Ingredient'
                },
            ]
        }
    ],
    Pizza:[
        {
            type:Schema.Types.ObjectId,
            ref:'Pizza',
            required:true
        }

    ],
    Total_price:{
        type:Number,
        required:true
    },
    OrderStatus:{
        type:String,
        required:true,
        enum:["Order received","In the Kitchen","Sent to delivery"],
        default:"Order received"
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    
})


const Order = mongoose.model( "Order" , orderSchema ); 