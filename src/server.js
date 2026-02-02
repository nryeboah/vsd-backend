import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import sopRoutes from "./routes/sops.js";
import officerRoutes from "./routes/officers.js";
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/officers", officerRoutes);
app.use("/api/sops", sopRoutes);
app.use("/api/auth", authRoutes);



// Health check
app.get("/", (req, res) => {
  res.json({ status: "VSD backend running" });
});

// Test DB connection
pool.query("SELECT NOW()")
  .then(res => {
    console.log("✅ Database connected at:", res.rows[0].now);
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
