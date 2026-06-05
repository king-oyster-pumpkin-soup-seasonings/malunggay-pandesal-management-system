"use client";

import { useEffect, useState } from "react";
import { Bowlby_One } from "next/font/google";

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

interface Product {
  id: number;
  product_name: string;
}

interface Production {
  id: number;
  product_id: number;
  quantity: number;
  produced_at: string;
}

export default function ProductionPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      const [productionRes, productsRes] = await Promise.all([
        fetch("/api/production"),
        fetch("/api/products"),
      ]);

      const [productionData, productsData] = await Promise.all([
        productionRes.json(),
        productsRes.json(),
      ]);

      if (productionData.success) {
        setProductions(productionData.data);
      }
      if (productsData.success) {
        setProducts(productsData.data);
      }
    } catch (error) {
      console.error("Error fetching production data:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormData({ product_id: "", quantity: "" });
    setIsModalOpen(true);
  }

  function openEditModal(production: Production) {
    setEditingId(production.id);
    setFormData({
      product_id: String(production.product_id),
      quantity: String(production.quantity),
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ product_id: "", quantity: "" });
  }

  function getProductName(productId: number) {
    return (
      products.find((product) => product.id === productId)?.product_name ||
      `Product #${productId}`
    );
  }

  async function handleSubmit() {
    const productId = Number(formData.product_id);
    const quantity = Number(formData.quantity);

    if (!productId || !quantity || quantity <= 0) {
      alert("Please select product and enter a valid quantity");
      return;
    }

    try {
      if (editingId) {
        const res = await fetch("/api/production", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            product_id: productId,
            quantity,
          }),
        });

        const data = await res.json();
        if (data.success) {
          await fetchAllData();
          closeModal();
        }
      } else {
        const res = await fetch("/api/production", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId, quantity }),
        });

        const data = await res.json();
        if (data.success) {
          await fetchAllData();
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error saving production record:", error);
      alert("Error saving production record");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch("/api/production", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        await fetchAllData();
      }
    } catch (error) {
      console.error("Error deleting production record:", error);
      alert("Error deleting production record");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-green-300 min-h-screen py-8">
      <div className="bg-white p-12 w-full max-w-5xl">
        <h1
          className={`text-4xl text-green-400 text-center mb-8 ${bowlbyOne.className}`}>
          Production
        </h1>

        <button
          onClick={openCreateModal}
          className="mb-6 px-6 py-2 bg-green-400 text-white hover:bg-green-500 transition-colors font-semibold">
          + Add Production
        </button>

        {loading ?
          <p className="text-center text-gray-500">Loading...</p>
        : productions.length === 0 ?
          <p className="text-center text-gray-500">No production records yet</p>
        : <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">
                    ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">
                    Product
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-green-700">
                    Produced At
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {productions.map((production) => (
                  <tr key={production.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {production.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {getProductName(production.product_id)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {production.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {new Date(production.produced_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {deleteConfirm === production.id ?
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDelete(production.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700">
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-400 text-white text-sm hover:bg-gray-500">
                            Cancel
                          </button>
                        </div>
                      : <div className="flex gap-2 justify-center">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8-lg shadow-lg w-full max-w-md p-8">
            <h2
              className={`text-2xl text-green-400 mb-4 ${bowlbyOne.className}`}>
              {editingId ? "Edit Production" : "Add Production"}
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <select
              value={formData.product_id}
              onChange={(e) =>
                setFormData({ ...formData, product_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 mb-4 focus:outline-none focus:border-green-400">
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Quantity"
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
