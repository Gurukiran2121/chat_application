import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
      const connection = await mongoose.connect(process.env.MONGO_DB_URL);
      console.log(`database connected successfully: ${connection.connection.host}`);
    } catch (error) {
        console.error(`error in connecting database : ${error}`);
    }
}
