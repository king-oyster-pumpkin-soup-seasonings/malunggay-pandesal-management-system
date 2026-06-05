"use client";

import { useEffect, useState } from "react";
import { Bowlby_One } from "next/font/google";

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

type Product = {
  id: number;
  product_name: string;
};

type Recipe = {
  id: number;
  product_id: number;
  ingredient_id: number;
  product_name: string;
  ingredient_name: string;
  quantity: number;
};

type Ingredient = {
  id: number;
  ingredient_name: string;
};

export default function RecipesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recipe, setRecipe] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    ingredient_id: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);
  const [recipeLoading, setRecipeLoading] = useState(false);

  async function fetchInitialData() {
    try {
      const [productsRes, ingredientsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/ingredients"),
      ]);

      const [productsJson, ingredientsJson] = await Promise.all([
        productsRes.json(),
        ingredientsRes.json(),
      ]);

      setProducts(productsJson.data ?? []);
      setIngredients(ingredientsJson.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function openProduct(product: Product) {
    setSelectedProduct(product);
    setDeleteConfirm(null);
    setEditingRecipe(null);
    setIsModalOpen(false);
    setFormData({ ingredient_id: "", quantity: "" });
    await fetchRecipe(product.id);
  }

  async function fetchRecipe(productId: number) {
    setRecipeLoading(true);

    try {
      const res = await fetch(`/api/recipes?product_id=${productId}`);
      const json = await res.json();

      setRecipe(json.data ?? []);
    } finally {
      setRecipeLoading(false);
    }
  }

  function closeDetail() {
    setSelectedProduct(null);
    setRecipe([]);
    setDeleteConfirm(null);
    setEditingRecipe(null);
    setIsModalOpen(false);
    setFormData({ ingredient_id: "", quantity: "" });
  }

  function openCreateModal() {
    if (!selectedProduct) {
      return;
    }

    setEditingRecipe(null);
    setFormData({ ingredient_id: "", quantity: "" });
    setIsModalOpen(true);
  }

  function openEditModal(recipeItem: Recipe) {
    setEditingRecipe(recipeItem);
    setFormData({
      ingredient_id: String(recipeItem.ingredient_id),
      quantity: String(recipeItem.quantity),
    });
    setIsModalOpen(true);
  }

  async function handleSubmit() {
    if (!selectedProduct) {
      return;
    }

    const ingredientId = Number(formData.ingredient_id);
    const quantity = Number(formData.quantity);

    if (Number.isNaN(ingredientId) || Number.isNaN(quantity) || quantity <= 0) {
      alert("Pick an ingredient and enter a quantity greater than zero.");
      return;
    }

    const payload =
      editingRecipe ?
        {
          id: editingRecipe.id,
          product_id: selectedProduct.id,
          ingredient_id: ingredientId,
          quantity,
        }
      : {
          product_id: selectedProduct.id,
          ingredient_id: ingredientId,
          quantity,
        };

    const res = await fetch("/api/recipes", {
      method: editingRecipe ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      await fetchRecipe(selectedProduct.id);
      setIsModalOpen(false);
      setEditingRecipe(null);
      setFormData({ ingredient_id: "", quantity: "" });
    } else {
      alert(json.message ?? "Unable to save recipe.");
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch("/api/recipes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      if (selectedProduct) {
        await fetchRecipe(selectedProduct.id);
      }
      setDeleteConfirm(null);
    } else {
      alert(json.message ?? "Unable to delete recipe.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-green-300 min-h-screen">
      <div className="flex w-full flex-col items-center justify-center p-16 bg-white dark:bg-black sm:items-start max-w-2xl">
        <h1
          className={`text-4xl mb-8 text-green-400 text-center self-center ${bowlbyOne.className}`}>
          Recipes
        </h1>

        {/* BACK BUTTON (detail view) */}
        <div className="flex flex-row gap-2 justify-between w-full">
          {selectedProduct && (
            <button
              onClick={closeDetail}
              className="mb-6 px-4 py-2 border-green-300 border-3 hover:scale-120 transition-transform bg-white">
              ← Back
            </button>
          )}

          {selectedProduct && (
            <button
              onClick={openCreateModal}
              className="mb-6 px-6 py-3 bg-green-400 text-white hover:bg-green-500 transition-colors font-semibold">
              + Add Recipe Item
            </button>
          )}
        </div>

        {/* GRID VIEW */}
        {!selectedProduct && (
          <>
            {loading ?
              <p>Loading...</p>
            : <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => openProduct(product)}
                    className="bg-gray-50 border-green-300 border-6 p-6 cursor-pointer hover:scale-105 transition">
                    <p className="text-lg font-semibold text-green-500">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-green-500/50">
                      Click to view recipe
                    </p>
                  </div>
                ))}
              </div>
            }
          </>
        )}

        {/* DETAIL VIEW */}
        {selectedProduct && (
          <div className="bg-white p-8 border-green-300 border-4 w-full max-w-2xl self-center">
            <h2 className="text-2xl font-bold mb-4">
              {selectedProduct.product_name} Recipe
            </h2>

            {recipeLoading ?
              <p className="text-green-500">Loading recipe...</p>
            : recipe.length === 0 ?
              <p className="text-green-500">No ingredients found</p>
            : <div className="space-y-3">
                {recipe.map((r) => (
                  <div
                    key={r.id}
                    className="border border-green-300 p-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{r.ingredient_name}</p>
                      <p className="text-sm text-green-600">
                        Quantity: {r.quantity}
                      </p>
                    </div>

                    {deleteConfirm === r.id ?
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700">
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-400 text-white text-sm hover:bg-gray-500">
                          Cancel
                        </button>
                      </div>
                    : <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(r)}
                          className="px-3 py-1 bg-blue-50 text-blue-400 text-sm hover:bg-blue-200">
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(r.id)}
                          className="px-3 py-1 bg-red-100 text-red-400 text-sm hover:bg-red-200">
                          ❌ Delete
                        </button>
                      </div>
                    }
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8-lg shadow-lg w-full max-w-md p-8">
              <h2
                className={`text-2xl text-green-400 mb-4 ${bowlbyOne.className}`}>
                {editingRecipe ?
                  "Edit Recipe Item"
                : `Add to ${selectedProduct.product_name}`}
              </h2>

              <div className="space-y-4">
                <select
                  value={formData.ingredient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredient_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-green-400">
                  <option value="">Select Ingredient</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.ingredient_name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-green-400"
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingRecipe(null);
                    setFormData({ ingredient_id: "", quantity: "" });
                  }}
                  className="px-4 py-2 bg-gray-400 text-white hover:bg-gray-500">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-400 text-white hover:bg-green-500">
                  {editingRecipe ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
