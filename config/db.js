import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const client = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    return client;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
