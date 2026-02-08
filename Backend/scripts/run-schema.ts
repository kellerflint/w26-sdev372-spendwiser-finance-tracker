import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function run() {
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Schema failed:", err);
    process.exit(1);
  } finally {
    await connection.end();
  }
  process.exit(0);
}

run();
