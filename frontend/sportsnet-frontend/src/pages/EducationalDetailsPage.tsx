import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import type {
  EducationalDetail,
  EducationalDetailRequest,
} from "../types/details";

const emptyForm: EducationalDetailRequest = {
  institutionName: "",
  description: "",
  startDate: "",
  endDate: "",
};

const EducationalDetailsPage = () => {
  const [items, setItems] = useState<EducationalDetail[]>([]);
  const [form, setForm] = useState<EducationalDetailRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get<EducationalDetail[]>("/education/me")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load educational details"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, form);
      } else {
        await api.post("/education", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const handleEdit = (item: EducationalDetail) => {
    setEditingId(item.id);
    setForm({
      institutionName: item.institutionName,
      description: item.description ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await api.delete(`/education/${id}`);
    load();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit" : "Add"} Educational Detail
        </h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="institutionName"
            placeholder="School / High School / University"
            value={form.institutionName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="text-sm text-gray-500">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-500">End Date</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">My Educational Details</h2>
        {items.length === 0 && (
          <p className="text-gray-500">No records added yet.</p>
        )}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{item.institutionName}</p>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {item.startDate || "?"} - {item.endDate || "Present"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationalDetailsPage;

