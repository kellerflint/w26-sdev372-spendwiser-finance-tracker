import path from "path";
import fs from "fs";
import { Router, Request } from "express";
import multer, { FileFilterCallback } from "multer";
import pool from "../db";

const router = Router();
const dir = path.join(process.cwd(), "uploads");

// Ensure directory exists at startup
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// check correct file format
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only .png, .jpg, .jpeg and .webp formats are allowed!"));
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase() || ".bin";
      cb(null, unique + ext);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

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

router.post("/", (req, res, next) => {
  // Use custom handler to catch Multer/Filter errors
  upload.single("image")(req, res, (err) => {
    console.log(req.body)
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { hobby, description, location, amount, expense_date } = req.body;
  
  if (!hobby || !amount || !expense_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // With proper typing, req.file is available
  const image_path = req.file ? "uploads/" + req.file.filename : null;
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