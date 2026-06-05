"use client";

import { useState, useEffect } from "react";
import { Bowlby_One } from "next/font/google";

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

interface Ingredient {
  id: number;
  ingredient_name: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ ingredient_name: "" });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  async function fetchIngredients() {
    try {
      const res = await fetch("/api/ingredients");
      const data = await res.json();
      if (data.success) {
        setIngredients(data.data);
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch ingredients on mount
  useEffect(() => {
    queueMicrotask(() => {
      void fetchIngredients();
    });
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setFormData({ ingredient_name: "" });
    setIsModalOpen(true);
  }

  function openEditModal(ingredient: Ingredient) {
    setEditingId(ingredient.id);
    setFormData({ ingredient_name: ingredient.ingredient_name });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormData({ ingredient_name: "" });
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!formData.ingredient_name.trim()) {
      alert("Ingredient name cannot be empty");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch("/api/ingredients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ingredient_name: formData.ingredient_name,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIngredients(
            ingredients.map((i) => (i.id === editingId ? data.data : i)),
          );
          closeModal();
        } else {
          alert(data.message ?? "Error saving ingredient");
        }
      } else {
        // Create
        const res = await fetch("/api/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredient_name: formData.ingredient_name }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIngredients([...ingredients, data.data]);
          closeModal();
        } else {
          alert(data.message ?? "Error saving ingredient");
        }
      }
    } catch (error) {
      console.error("Error saving ingredient:", error);
      alert("Error saving ingredient");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch("/api/ingredients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setIngredients(ingredients.filter((i) => i.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert("Error deleting ingredient");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-green-300 min-h-screen py-8">
      <div className="bg-white p-12 w-full max-w-xl">
        <h1
          className={`text-4xl text-green-400 text-center mb-8 ${bowlbyOne.className}`}>
          Ingredients
        </h1>

        <button
          onClick={openCreateModal}
          className="mb-6 px-6 py-2 bg-green-400 text-white hover:bg-green-500 transition-colors font-semibold">
          + Add Ingredient
        </button>

        {loading ?
          <p className="text-center text-gray-500">Loading...</p>
        : ingredients.length === 0 ?
          <p className="text-center text-gray-500">No ingredients yet</p>
        : <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <p className="text-gray-700 font-medium">
                  {ingredient.ingredient_name}
                </p>

                {deleteConfirm === ingredient.id ?
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(ingredient.id)}
                      className="px-4 py-1 bg-red-600 text-white text-sm hover:bg-red-700">
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-1 bg-gray-400 text-white text-sm hover:bg-gray-500">
                      Cancel
                    </button>
                  </div>
                : <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(ingredient)}
                      className="px-3 py-1 bg-blue-50 text-blue-400 text-sm hover:bg-blue-200">
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(ingredient.id)}
                      className="px-3 py-1 bg-red-100 text-red-400  text-sm hover:bg-red-200">
                      ❌ Delete
                    </button>
                  </div>
                }
              </div>
            ))}
          </div>
        }
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8-lg shadow-lg w-full max-w-md p-8">
            <h2
              className={`text-2xl text-green-400 mb-4 ${bowlbyOne.className}`}>
              {editingId ? "Edit Ingredient" : "Add Ingredient"}
            </h2>
            <input
              type="text"
              placeholder="Ingredient Name"
              value={formData.ingredient_name}
              onChange={(e) => setFormData({ ingredient_name: e.target.value })}
              maxLength={67}
              className="w-full px-4 py-2 border border-gray-300 mb-4 focus:outline-none focus:border-green-400"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-400 text-white hover:bg-green-500">
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
