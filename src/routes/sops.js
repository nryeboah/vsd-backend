import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all SOPs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sops WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching SOPs:", err.message);
    res.status(500).json({ error: "Failed to fetch SOPs" });
  }
});

export default router;
