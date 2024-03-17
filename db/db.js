import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
  .then(() => console.log("Database connection successfull"))
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  });

