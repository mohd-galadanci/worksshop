import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API = import.meta.env.VITE_API_URL;

type FoodItem = {
  id: number;
  name: string;
  price: number;
  unit: string;
  available: boolean;
  image?: string | null;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ price: 0, available: true });
  const [newItem, setNewItem] = useState({ name: "", price: 0, unit: "", image: "", available: true });

  const token = localStorage.getItem("adminToken") || "";

  const fetchItems = async () => {
    const res = await fetch(`${API}/food-items`); // public list endpoint
    const data = await res.json();
    setItems(data);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setEditData({ price: item.price, available: item.available });
  };

  const handleSave = async () => {
    const res = await fetch(`${API}/admin/food/${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${token},
      },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      setEditingId(null);
      fetchItems();
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${API}/admin/food/${id}`, {
      method: "DELETE",
      headers: { Authorization: Bearer ${token} },
    });
if (res.ok) {
      fetchItems();
    } else {
      alert("Delete failed");
    }
  };

  const handleAdd = async () => {
    const res = await fetch(`${API}/admin/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${token},
      },
      body: JSON.stringify(newItem),
    });

    if (res.ok) {
      setNewItem({ name: "", price: 0, unit: "", image: "", available: true });
      fetchItems();
    } else {
      alert("Add failed");
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
    } else {
      fetchItems();
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin: Food Item Control</h2>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
          }}
          className="text-sm text-red-500"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 bg-white p-4 rounded shadow-md">
        <h3 className="font-semibold mb-2">Add New Item</h3>
        <div className="grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Input
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
          <Input
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
            />
          </div>
          <div className="col-span-4 flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              checked={newItem.available}
              onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
            />
            <label htmlFor="available">Available?</label>
          </div>
          <Button onClick={handleAdd}>Add Item</Button>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border rounded p-4 shadow-sm flex items-center gap-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600">Unit: {item.unit}</p>
            </div>

            {editingId === item.id ? (
              <div className="flex gap-2 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Available</label>
                  <select
                    value={editData.available ? "true" : "false"}
                    onChange={(e) =>
                      setEditData({ ...editData, available: e.target.value === "true" })
}
                    className="border p-2 rounded"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <Button onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>₦{item.price}</span>
                <span className={item.available ? "text-green-600" : "text-red-600"}>
                  {item.available ? "Available" : "Out of stock"}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
