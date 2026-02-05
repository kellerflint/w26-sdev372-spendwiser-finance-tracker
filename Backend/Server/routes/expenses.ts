import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses ORDER BY expense_date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.post("/", async (req, res) => {
  const { hobby, description, location, amount, expense_date, image_path } = req.body;

  if (!hobby || !amount || !expense_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      `INSERT INTO expenses (hobby, description, location, amount, expense_date, image_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [hobby, description, location, amount, expense_date, image_path]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to insert expense" });
  }
});

export default router;
