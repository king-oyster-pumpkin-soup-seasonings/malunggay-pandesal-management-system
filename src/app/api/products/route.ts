import { pool } from "@/library/database/pool";
import { createProduct } from "@/library/database/products/create";

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productName = String(body.product_name ?? "").trim();

    if (!productName) {
      return Response.json(
        { success: false, message: "Product name cannot be empty." },
        { status: 400 },
      );
    }

    const result = await createProduct(productName);
    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json(
        { success: false, message: "This product already exists." },
        { status: 409 },
      );
    }

    console.error("Error creating product:", error);
    return Response.json(
      { success: false, message: "Unable to create product." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return Response.json({
    success: true,
    data: result.rows,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const productName = String(body.product_name ?? "").trim();

    if (!productName) {
      return Response.json(
        { success: false, message: "Product name cannot be empty." },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "UPDATE products SET product_name = $1 WHERE id = $2 RETURNING *",
      [productName, id],
    );

    return Response.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json(
        { success: false, message: "This product already exists." },
        { status: 409 },
      );
    }

    console.error("Error updating product:", error);
    return Response.json(
      { success: false, message: "Unable to update product." },
      { status: 500 },
    );
  }
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
