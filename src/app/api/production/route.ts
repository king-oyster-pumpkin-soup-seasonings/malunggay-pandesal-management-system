import { pool } from "@/library/database/pool";

export async function GET() {
  const result = await pool.query("SELECT * FROM production ORDER BY id DESC");
  return Response.json({
    success: true,
    data: result.rows,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { product_id, quantity } = body;
  const result = await pool.query(
    `
    INSERT INTO production
    (product_id, quantity)
    VALUES ($1, $2)
    RETURNING *
    `,
    [product_id, quantity],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { product_id, quantity, id } = body;
  const result = await pool.query(
    `
    UPDATE production
    SET product_id = $1, quantity = $2
    WHERE id = $3
    RETURNING *
    `,
    [product_id, quantity, id],
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
    "DELETE FROM production WHERE id = $1 RETURNING *",
    [id],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}
