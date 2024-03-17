import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";

const app = express();

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
  .then(() => console.log("Database connection successfull"))
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

// Handle 404
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// Handle 500
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});