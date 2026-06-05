import { pool } from "@/library/database/pool";

export async function GET() {
  const result = await pool.query("SELECT 1");
  return Response.json({
    success: true,
    rows: result.rows,
  });
}
