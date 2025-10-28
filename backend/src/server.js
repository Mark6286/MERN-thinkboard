import express from "express";
import cors from "cors";
import notesRouter from "./routes/noteRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(express.json());
app.use(cors());
app.use(rateLimiter);
app.use("/api/notes", notesRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is started on port: 5001");
  });
});
