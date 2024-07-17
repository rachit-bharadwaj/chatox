import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";

// socket io
import setupSocket from "./socket";

// routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import contactRoutes from "./routes/contact";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL!],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// ------- Routes and controllers ------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with the server
setupSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
