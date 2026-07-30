import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { TeamDetail, TeamDetailRequest } from "../types/details";

const emptyForm: TeamDetailRequest = {
  teamName: "",
  details: "",
  startDate: "",
  endDate: "",
};

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition";
const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

const TeamDetails = () => {
  const [items, setItems] = useState<TeamDetail[]>([]);
  const [form, setForm] = useState<TeamDetailRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get<TeamDetail[]>("/teams/me")
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load team details"))
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
        await api.put(`/teams/${editingId}`, form);
      } else {
        await api.post("/teams", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  const handleEdit = (item: TeamDetail) => {
    setEditingId(item.id);
    setForm({
      teamName: item.teamName,
      details: item.details ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await api.delete(`/teams/${id}`);
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
          {editingId ? "Edit Team Detail" : "Add Team Detail"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Team Name</label>
            <input
              name="teamName"
              placeholder="e.g. Ruhuna University Cricket Team"
              value={form.teamName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Details</label>
            <textarea
              name="details"
              placeholder="e.g. Playing as vice-captain"
              value={form.details}
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
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors"
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
        <h2 className="text-base font-semibold text-gray-900 mb-4">My Teams</h2>

        {items.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No records added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-100 border-l-4 border-l-purple-500 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.teamName}</p>
                  {item.details && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.details}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                    {item.startDate || "?"} – {item.endDate || "Present"}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs font-medium text-purple-600 hover:bg-purple-50 px-2.5 py-1 rounded-lg"
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

export default TeamDetails;
