import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";

const router = express.Router();

/**
 * REGISTER OFFICER
 * POST /api/officers/register
 */
router.post("/register", async (req, res) => {
  const {
    staff_id,
    name,
    role,
    job_description,
    contact_number,
    pin
  } = req.body;

  if (!staff_id || !name || !role || !pin) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if officer already exists
    const existing = await pool.query(
      "SELECT id FROM officers WHERE staff_id = $1",
      [staff_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Officer already registered" });
    }

    // Hash PIN
    const saltRounds = 10;
    const pin_hash = await bcrypt.hash(pin, saltRounds);

    // Insert officer
    const result = await pool.query(
      `INSERT INTO officers
       (staff_id, name, role, job_description, contact_number, pin_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, staff_id, name, role, created_at`,
      [staff_id, name, role, job_description, contact_number, pin_hash]
    );

    res.status(201).json({
      message: "Officer registered successfully",
      officer: result.rows[0]
    });

  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
