import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import routes
import userRoutes from "./modules/user/user.route.js";
import technicianRoutes from "./modules/technician/technician.route.js";
import chatRoutes from "./modules/chat/chat.route.js";
import serviceRequestRoutes from "./modules/service_request/service_request.route.js";
import reviewRoutes from "./modules/review/review.route.js";
import activityLogRoutes from "./modules/activity_log/activity_log.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// Cache the Mongoose connection across serverless invocations so cold starts
// don't open a new socket per request and so warm invocations skip the connect.
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGO_DB_URI;
    if (!uri) {
      throw new Error("MONGO_DB_URI is not set");
    }
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => {
        console.log("Connected to MongoDB");
        return m;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

// Ensure the DB is connected before any route handler runs. Without this,
// Mongoose buffers the operation while the connection is still pending and
// throws "Operation buffering timed out after 10000ms" on Vercel cold starts.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Image static folder
app.use("/images", express.static("images"));

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/service-request", serviceRequestRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/activity-log", activityLogRoutes);

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

const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || "0.0.0.0";

if (!process.env.VERCEL) {
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

export default app;
