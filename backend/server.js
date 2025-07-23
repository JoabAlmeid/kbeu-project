import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allows to parse body from frontend
app.use(cookieParser()); //allows to parse refreshToken from cookie

app.use("/api/auth", authRoutes); //allows navigation through signup, login, logout, etc

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

connectDB();
