import { pool } from "@/library/database/pool";

export async function POST(request: Request) {
  const body = await request.json();
  const { product_id, ingredient_id, quantity } = body;
  const result = await pool.query(
    `
    INSERT INTO recipes
    (product_id, ingredient_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [product_id, ingredient_id, quantity],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}

export async function GET() {
  const result = await pool.query(
    `SELECT 
      r.id,
      p.product_name,
      i.ingredient_name,
      r.quantity
     FROM recipes r
     JOIN products p ON p.id = r.product_id
     JOIN ingredients i ON i.id = r.ingredient_id
     ORDER BY r.id ASC`,
  );

  return Response.json({
    success: true,
    data: result.rows,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, product_id, ingredient_id, quantity } = body;
  const result = await pool.query(
    `
    UPDATE recipes
    SET product_id = $1, ingredient_id = $2, quantity = $3
    WHERE id = $4
    `,
    [product_id, ingredient_id, quantity, id],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const result = await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}
