import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";
import expensesRouter from "./routes/expenses";
import path from "path";
import categories from "./routes/categories"
import deleteRouter from "./routes/delete";
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/db-health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ db: "connected" });
  } catch {
    res.status(500).json({ db: "failed" });
  }
});
app.use("/expenses", expensesRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/categories", categories)
app.use("/delete", deleteRouter);
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});

export default app;