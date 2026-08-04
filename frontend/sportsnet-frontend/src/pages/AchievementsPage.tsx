import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import type { Achievement, AchievementRequest } from "../types/details";
import type { SportProfileResponse } from "../types/sportProfile";

const emptyForm = { title: "", description: "" };

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-white";
const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider";

const AchievementsPage = ({ sportProfileId: initialSportProfileId }: { sportProfileId?: string }) => {
  const [sportProfiles, setSportProfiles] = useState<SportProfileResponse[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string>(initialSportProfileId || "");
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSportProfileId) {
      setSelectedSportId(initialSportProfileId);
    } else {
      api.get<SportProfileResponse[]>("/sport-profiles/me")
        .then((res) => {
          setSportProfiles(res.data);
          if (res.data.length > 0 && !selectedSportId) {
            setSelectedSportId(res.data[0].id);
          }
        })
        .catch(() => setError("Failed to load sport profiles"));
    }
  }, [initialSportProfileId]);

  const loadAchievements = (profileId: string) => {
    if (!profileId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get<Achievement[]>(`/sport-profiles/${profileId}/achievements`)
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load achievements"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedSportId) {
      loadAchievements(selectedSportId);
    } else {
      setLoading(false);
    }
  }, [selectedSportId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSportId) return;

    setError("");
    setSaving(true);

    const payload: AchievementRequest = {
      title: form.title,
      description: form.description || undefined,
    };

    try {
      if (editingId) {
        await api.put(`/sport-profiles/${selectedSportId}/achievements/${editingId}`, payload);
      } else {
        await api.post(`/sport-profiles/${selectedSportId}/achievements`, payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadAchievements(selectedSportId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save achievement");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Achievement) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description ?? "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      await api.delete(`/sport-profiles/${selectedSportId}/achievements/${id}`);
      loadAchievements(selectedSportId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (!initialSportProfileId && sportProfiles.length === 0 && !loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-4">
        
        <h2 className="text-xl font-bold text-gray-900">No Sport Profiles Found</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Achievements are linked to a specific sport profile. Please add a Sport Profile first.
        </p>
        <Link
          to="/account/sports"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20"
        >
          + Create Sport Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!initialSportProfileId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Achievements</h1>
            <p className="text-sm text-gray-500">
              Highlight trophies, awards, and major milestones
            </p>
          </div>
          {sportProfiles.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">
                Sport:
              </label>
              <select
                value={selectedSportId}
                onChange={(e) => setSelectedSportId(e.target.value)}
                className="border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-gray-50 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                {sportProfiles.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.sport} {sp.position ? `(${sp.position})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-xs font-bold text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <span>
            {editingId ? "✏️ Edit Achievement" : "➕ Add Achievement"}
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Achievement Title *</label>
            <input
              name="title"
              placeholder="e.g. Best Batsman - All Island Inter-School Championship 2024"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description / Details</label>
            <textarea
              name="description"
              placeholder="e.g. Scored 540 runs across 8 innings with 2 centuries"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Achievement"
                  : "Save Achievement"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-all text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
          <span>Achievements List</span>
          <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
            {items.length} {items.length === 1 ? "Achievement" : "Achievements"}
          </span>
        </h2>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl space-y-1">
            <p className="text-gray-500 font-medium text-sm">
              No achievements added yet
            </p>
            <p className="text-gray-400 text-xs">
              Highlight your sports accomplishments using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-100 border-l-4 border-l-amber-500 rounded-2xl p-4 flex items-start justify-between bg-white hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    
                    <span>{item.title}</span>
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 pl-6">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs font-medium text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
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
