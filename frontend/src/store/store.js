import { configureStore } from "@reduxjs/toolkit";

import authslice from "./Authslice";


const store = configureStore({
    reducer:{
        auth:authslice,

        
    }
})

export default store