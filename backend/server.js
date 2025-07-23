import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allows to parse body from frontend

app.use("/api/auth", authRoutes); //allows navigation through signup, login, logout, etc

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

connectDB();
//DnwC30sPHTZLFN8y
