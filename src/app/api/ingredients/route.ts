import { pool } from "@/library/database/pool";

export async function POST(request: Request) {
  const body = await request.json();
  const { ingredient_name } = body;
  const result = await pool.query(
    "INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING *",
    [ingredient_name],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}

export async function GET() {
  const result = await pool.query("SELECT * FROM ingredients ORDER BY id ASC");
  return Response.json({
    success: true,
    data: result.rows,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ingredient_name } = body;
  const result = await pool.query(
    "UPDATE ingredients SET ingredient_name = $1 WHERE id = $2 RETURNING *",
    [ingredient_name, id],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const result = await pool.query(
    "DELETE FROM ingredients WHERE id = $1 RETURNING *",
    [id],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}
