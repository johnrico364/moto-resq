import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import userRoutes from "./modules/user/user.route.js";

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());

const _dbURI = process.env.MONGO_DB_URI;

mongoose.connect(_dbURI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

// Image static folder
app.use("/images", express.static("images"));

// API ROUTES
app.use("/api/users", userRoutes);





app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});