import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,  
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    pizzas:[
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
    ]
    
})


const Order = mongoose.model( "Order" , orderSchema ); 