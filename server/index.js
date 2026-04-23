import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { WebSocketServer } from "ws";

// Import routes
import userRoutes from "./modules/user/user.route.js";
import technicianRoutes from "./modules/technician/technician.route.js";
import chatRoutes from "./modules/chat/chat.route.js";
import serviceRequestRoutes from "./modules/service_request/service_request.route.js";
import reviewRoutes from "./modules/review/review.route.js";

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());

const _dbURI = process.env.MONGO_DB_URI;

mongoose
  .connect(_dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Image static folder
app.use("/images", express.static("images"));

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/service-request", serviceRequestRoutes);
app.use("/api/review", reviewRoutes);

const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || "0.0.0.0";
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
  const path = req.url || "/";
  if (!path.startsWith("/ws/booking")) {
    socket.close(1008, "Unsupported websocket path");
    return;
  }

  socket.send(
    JSON.stringify({
      type: "connected",
      path,
      timestamp: new Date().toISOString(),
    }),
  );

  socket.on("message", (raw) => {
    // Broadcast incoming booking updates to all active subscribers.
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(raw.toString());
      }
    }
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});
