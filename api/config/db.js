import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(" MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(" MongoDB disconnected. Attempting to reconnect...");
      connectDB();
    });
  } catch (error) {
    console.error(" Initial MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
