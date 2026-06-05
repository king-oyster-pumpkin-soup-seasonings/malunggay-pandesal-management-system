import { pool } from "../pool";

export async function createProduct(product_name: string) {
  const result = await pool.query(
    "INSERT INTO products (product_name) VALUES ($1) RETURNING *",
    [product_name],
  );
  return result.rows[0];
}
