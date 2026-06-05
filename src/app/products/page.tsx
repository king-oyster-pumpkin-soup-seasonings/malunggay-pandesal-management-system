"use client";

import { useState, useEffect } from "react";
import { Bowlby_One } from "next/font/google";

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

interface Product {
  id: number;
  product_name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ product_name: "" });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch products on mount
  useEffect(() => {
    queueMicrotask(() => {
      void fetchProducts();
    });
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setFormData({ product_name: "" });
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setFormData({ product_name: product.product_name });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormData({ product_name: "" });
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!formData.product_name.trim()) {
      alert("Product name cannot be empty");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch("/api/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            product_name: formData.product_name,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(
            products.map((p) => (p.id === editingId ? data.data : p)),
          );
          closeModal();
        } else {
          alert(data.message ?? "Error saving product");
        }
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_name: formData.product_name }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts([...products, data.data]);
          closeModal();
        } else {
          alert(data.message ?? "Error saving product");
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-green-300 min-h-screen py-8">
      <div className="bg-white p-12 w-full max-w-4xl">
        <h1
          className={`text-4xl text-green-400 text-center mb-8 ${bowlbyOne.className}`}>
          Products
        </h1>

        <button
          onClick={openCreateModal}
          className="mb-6 px-6 py-2 bg-green-400 text-white  hover:bg-green-500 transition-colors font-semibold">
          + Add Product
        </button>

        {loading ?
          <p className="text-center text-gray-500">Loading...</p>
        : products.length === 0 ?
          <p className="text-center text-gray-500">No products yet</p>
        : <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">
                    ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">
                    Product Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {product.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {product.product_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {deleteConfirm === product.id ?
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-600 text-white  text-sm hover:bg-red-700">
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-400 text-white  text-sm hover:bg-gray-500">
                            Cancel
                          </button>
                        </div>
                      : <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openEditModal(product)}
                            className="px-3 py-1 bg-blue-50 text-blue-400 text-sm hover:bg-blue-200">
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="px-3 py-1 bg-red-100 text-red-400 text-sm hover:bg-red-200">
                            ❌ Delete
                          </button>
                        </div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/33 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 shadow-lg w-full max-w-md">
            <h2
              className={`text-2xl text-green-400 mb-4 ${bowlbyOne.className}`}>
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={(e) => setFormData({ product_name: e.target.value })}
              maxLength={67}
              className="w-full px-4 py-2 border border-gray-300  mb-4 focus:outline-none focus:border-green-400"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white  hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-400 text-white  hover:bg-green-500">
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
