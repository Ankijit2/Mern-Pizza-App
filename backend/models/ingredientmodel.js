import mongoose,{Schema} from "mongoose";


const ingredientSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    category: {
      type: String,
      enum: ['Base', 'Sauce', 'Cheese', 'Veggie', 'Meat'], 
    },
    price: { 
      type: Number,
      required: true,
    },
  });

export const Ingredient =  mongoose.model("Ingredient",ingredientSchema);