import mongoose from "mongoose";

export async function connectDatabase() {

  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/newsapp_auth1";

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:",error);
    throw error;
  }
}