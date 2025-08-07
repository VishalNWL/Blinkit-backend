import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
});

if(!process.env.DB_URL){
    throw new Error("Provide the DB name");
}

const connectDB =async ()=>{
  try {
    const instance= await mongoose.connect(process.env.DB_URL)
     console.log("DB connected successfully at host "+ instance.connection.host);
  } catch (error) {
    console.log("There is error while connecting with db "+error)
    process.exit(1);
  }
}

export {connectDB}