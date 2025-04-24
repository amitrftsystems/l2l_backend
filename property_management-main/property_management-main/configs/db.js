import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const host = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to the database ${host.connection.host}`);
  } catch (err) {
    console.log(`An error occured while connecting to database: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
