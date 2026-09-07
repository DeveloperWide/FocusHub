import mongoose from "mongoose";

// Connect to MongoDB
export const connectDb = async (): Promise<void> => {
  try {
    const db_Url = process.env.DB_URL;
    if (!db_Url) {
      throw new Error("db_URL is not defined in environment variable");
    }
    const conn = await mongoose.connect(db_Url);
    console.log("Mongo Connection : ", conn.connection.host);
  } catch (err) {
    console.log("Mongo Connection error : ", err);
    process.exit(1);
  }
};
