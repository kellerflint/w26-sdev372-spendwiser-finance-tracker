import pool from "../Server/db";

async function run() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to database...");

    try {
      await connection.query(`
            ALTER TABLE expenses
            ADD COLUMN image_path VARCHAR(255) NULL
        `);
      console.log("Successfully added image column to expenses table.");
    } catch (err: any) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("Column image already exists.");
      } else {
        throw err;
      }
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

run();
