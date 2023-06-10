import mongoose from "mongoose";

// TODO: Replace this with env config
const uri = process.env.MONGO_URI || "";

const connectToDB = async () => {
  try {
    return await mongoose.connect(uri);
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
};

mongoose.connection.on("connected", () => {
  // eslint-disable-next-line no-console
  console.log("Connected to database");
});

export default connectToDB;
