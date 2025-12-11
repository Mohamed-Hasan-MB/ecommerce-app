// 1) Import mongoose for database operations
import mongoose from "mongoose";

// 2) Export an async function to connect to MongoDB
export async function connectMongo(uri) {
  if (!uri) throw new Error("Missing MongoDB URI");

  // 3) Connect using the provided URI
  await mongoose.connect(uri, {
    // 4) Options are mostly automatic in modern mongoose
  });

  // 5) Log once connected
  console.log("MongoDB connected");
}