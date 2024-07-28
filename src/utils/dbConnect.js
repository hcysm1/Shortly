import mongoose from "mongoose";

const connection = () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  mongoose.connect(MONGODB_URI);

  mongoose.connection.on("connected", () => {
    console.log("Database connected successfully");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
  });

  mongoose.connection.on("error", (error) => {
    console.log("Error while connecting with the database", error.message);
  });
};

export default connection;
