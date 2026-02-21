import { Router } from "express";
import db from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
  res.json({ message: "Category added" });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
  res.json({ message: "Category deleted" });
});

export default router;
