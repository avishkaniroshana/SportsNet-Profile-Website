import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { TeamDetail, TeamDetailRequest } from "../types/details";

const emptyForm: TeamDetailRequest = {
  teamName: "",
  details: "",
  startDate: "",
  endDate: "",
};

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit" : "Add"} Team Detail
        </h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="teamName"
            placeholder="Team Name"
            value={form.teamName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="details"
            placeholder="Details"
            value={form.details}
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
        <h2 className="text-xl font-bold mb-4">My Teams</h2>
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
                <p className="font-semibold">{item.teamName}</p>
                {item.details && (
                  <p className="text-sm text-gray-600">{item.details}</p>
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

export default TeamDetails;

