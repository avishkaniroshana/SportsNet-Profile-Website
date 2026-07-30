import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { ClubDetail, ClubDetailRequest } from "../types/details";

const emptyForm: ClubDetailRequest = {
  clubName: "",
  description: "",
  startDate: "",
  endDate: "",
};

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition";
const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

const ClubDetailsPage = () => {
  const [items, setItems] = useState<ClubDetail[]>([]);
  const [form, setForm] = useState<ClubDetailRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get<ClubDetail[]>("/clubs/me")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load clubs details"))
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
        await api.put(`/clubs/${editingId}`, form);
      } else {
        await api.post("/clubs", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const handleEdit = (item: ClubDetail) => {
    setEditingId(item.id);
    setForm({
      clubName: item.clubName,
      description: item.description ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await api.delete(`/clubs/${id}`);
    load();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-56 bg-white rounded-2xl shadow-sm" />
        <div className="h-40 bg-white rounded-2xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {editingId ? "Edit Club Detail" : "Add Club Detail"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Club Name</label>
            <input
              name="clubName"
              placeholder="e.g. Kandy Cricket Club"
              value={form.clubName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              placeholder="e.g. Playing as an opening batsman"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className={labelClass}>Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="w-1/2">
              <label className={labelClass}>End Date</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
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
        <h2 className="text-base font-semibold text-gray-900 mb-4">My Clubs</h2>

        {items.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No records added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-100 border-l-4 border-l-emerald-500 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.clubName}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                    {item.startDate || "?"} – {item.endDate || "Present"}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs font-medium text-emerald-600 hover:bg-emerald-50 px-2.5 py-1 rounded-lg"
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

export default ClubDetailsPage;
