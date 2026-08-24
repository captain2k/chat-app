import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const {MONGO_URI} = process.env
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined')
    }
    const conn = await mongoose.connect(MONGO_URI)
    console.log('Connect to MongoDB: ', conn.connection.host)
  } catch (error) {
    console.log('Failed connect to MongoDB: ', error)
    process.exit(1)
  }
}
    