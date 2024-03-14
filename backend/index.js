import {app} from "./app.js"
import "dotenv/config"
import { connectDB } from "./database/db.js"

const PORT = process.env.PORT


app.get('/',(req,res)=>{
  res.send("working")
})


async function startServer() {
    await connectDB(); 
  
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  
  startServer();
