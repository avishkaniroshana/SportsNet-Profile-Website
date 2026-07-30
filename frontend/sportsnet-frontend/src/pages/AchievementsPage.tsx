import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Achievement, AchievementRequest } from "../types/details";

const emptyForm: AchievementRequest = { title: "", description: "" };

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition";
const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

const AchievementsPage = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState<AchievementRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get<Achievement[]>("/achievements/me")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load achievements"))
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
        await api.put(`/achievements/${editingId}`, form);
      } else {
        await api.post("/achievements", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const handleEdit = (item: Achievement) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description ?? "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await api.delete(`/achievements/${id}`);
    load();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-48 bg-white rounded-2xl shadow-sm" />
        <div className="h-40 bg-white rounded-2xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {editingId ? "Edit Achievement" : "Add Achievement"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              name="title"
              placeholder="e.g. Best Batsman - District Championship 2024"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              placeholder="e.g. Scored highest runs in the tournament"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 bg-amber-600 text-white py-2.5 rounded-xl font-medium hover:bg-amber-700 transition-colors"
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-white border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          My Achievements
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No records added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-100 border-l-4 border-l-amber-500 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs font-medium text-amber-600 hover:bg-amber-50 px-2.5 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
