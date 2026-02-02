import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

/**
 * LOGIN OFFICER
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { staff_id, pin } = req.body;

    if (!staff_id || !pin) {
      return res.status(400).json({ error: "Staff ID and PIN required" });
    }

    // Find officer
    const result = await pool.query(
      "SELECT * FROM officers WHERE staff_id = $1",
      [staff_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const officer = result.rows[0];

    // Compare PIN
    const isMatch = await bcrypt.compare(pin, officer.pin_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: officer.id,
        staff_id: officer.staff_id,
        role: officer.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      officer: {
        id: officer.id,
        staff_id: officer.staff_id,
        name: officer.name,
        role: officer.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
