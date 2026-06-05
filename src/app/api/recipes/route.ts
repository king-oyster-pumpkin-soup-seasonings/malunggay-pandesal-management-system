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
  return Response.json({ success: true, data: result.rows[0] });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");

  const values: Array<number> = [];

  const query = `
    SELECT
      r.id,
      r.product_id,
      r.ingredient_id,
      p.product_name,
      i.ingredient_name,
      r.quantity
    FROM recipes r
    JOIN products p ON p.id = r.product_id
    JOIN ingredients i ON i.id = r.ingredient_id
    ${productId ? "WHERE r.product_id = $1" : ""}
    ORDER BY r.id ASC
  `;

  if (productId) {
    values.push(Number(productId));
  }

  const result = await pool.query(query, values);

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
    RETURNING *
    `,
    [product_id, ingredient_id, quantity, id],
  );
  return Response.json({ success: true, data: result.rows[0] });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const result = await pool.query(
    "DELETE FROM recipes WHERE id = $1 RETURNING *",
    [id],
  );
  return Response.json({ success: true, data: result.rows[0] });
}
