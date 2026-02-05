import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";
import expensesRouter from "./routes/expenses";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ status: "ok", db: (rows as any)[0].result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

app.use("/expenses", expensesRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
