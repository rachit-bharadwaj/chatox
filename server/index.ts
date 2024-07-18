import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";

// socket io
import setupSocket from "./socket";

// routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import contactRoutes from "./routes/contact";
import chatRoutes from "./routes/chat";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL!],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// ------- Routes and controllers ------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);

// Serve static files
app.use("/temp", express.static("/temp"));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with the server
setupSocket(server);

// for deployment
const __dirName = path.resolve();
// get the current working directory's parent directory
const rootDir = path.resolve(__dirName, "..");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "/client/build")));
  app.get("*", (req, res) => {
    console.log(__dirName);
    res.sendFile(path.resolve(rootDir, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("The server is running in development mode.");
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
