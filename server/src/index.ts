import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes
// import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());

// ------- Routes and controllers ------
// app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
