import { pool } from "@/library/database/pool";
import { createProduct } from "@/library/database/products/create";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createProduct(body.product_name);
  return Response.json({
    success: true,
    data: result,
  });
}

export async function GET() {
  const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return Response.json({
    success: true,
    data: result.rows,
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, product_name } = body;
  const result = await pool.query(
    "UPDATE products SET product_name = $1 WHERE id = $2 RETURNING *",
    [product_name, id],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [body.id],
  );
  return Response.json({
    success: true,
    data: result.rows[0],
  });
}
