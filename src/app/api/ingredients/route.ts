import { pool } from "@/library/database/pool";

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
    const ingredientName = String(body.ingredient_name ?? "").trim();

    if (!ingredientName) {
      return Response.json(
        { success: false, message: "Ingredient name cannot be empty." },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING *",
      [ingredientName],
    );

    return Response.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json(
        { success: false, message: "This ingredient already exists." },
        { status: 409 },
      );
    }

    console.error("Error creating ingredient:", error);
    return Response.json(
      { success: false, message: "Unable to create ingredient." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const result = await pool.query("SELECT * FROM ingredients ORDER BY id ASC");
  return Response.json({
    success: true,
    data: result.rows,
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const ingredientName = String(body.ingredient_name ?? "").trim();

    if (!ingredientName) {
      return Response.json(
        { success: false, message: "Ingredient name cannot be empty." },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "UPDATE ingredients SET ingredient_name = $1 WHERE id = $2 RETURNING *",
      [ingredientName, id],
    );

    return Response.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json(
        { success: false, message: "This ingredient already exists." },
        { status: 409 },
      );
    }

    console.error("Error updating ingredient:", error);
    return Response.json(
      { success: false, message: "Unable to update ingredient." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const result = await pool.query(
      "DELETE FROM ingredients WHERE id = $1 RETURNING *",
      [id],
    );
    return Response.json({ success: true, data: result.rows[0] });
  } catch (error) {
    // Foreign key violation: cannot delete ingredient used in recipes
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23503"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Cannot delete ingredient: it is used by one or more recipes. Remove recipe items first.",
        },
        { status: 409 },
      );
    }

    console.error("Error deleting ingredient:", error);
    return Response.json(
      { success: false, message: "Unable to delete ingredient." },
      { status: 500 },
    );
  }
}
