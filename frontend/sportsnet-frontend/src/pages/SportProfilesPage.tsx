import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import type {
  SportProfileRequest,
  SportProfileResponse,
} from "../types/sportProfile";

const emptyForm: SportProfileRequest = { sport: "", position: "", bio: "" };

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white";
const labelClass =
  "block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider";

const SportProfilesPage = () => {
  const [profiles, setProfiles] = useState<SportProfileResponse[]>([]);
  const [form, setForm] = useState<SportProfileRequest>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get<SportProfileResponse[]>("/sport-profiles/me")
      .then((res) => setProfiles(res.data))
      .catch(() => setError("Failed to load your sport profiles"))
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
    setSaving(true);
    try {
      await api.post("/sport-profiles", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add sport profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this sport profile? Its achievements, clubs, and teams will also be removed.",
      )
    )
      return;
    try {
      await api.delete(`/sport-profiles/${id}`);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete sport profile");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-40 bg-white rounded-3xl shadow-sm" />
        <div className="h-40 bg-white rounded-3xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Sport Profiles
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Add a profile for each sport you play. Achievements, clubs, and
            teams are organized per sport.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          {showForm ? "Cancel" : " + Add Sport"}
        </button>
      </div>

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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Add New Sport Profile
          </h2>

          <div>
            <label className={labelClass}>Sport Name *</label>
            <input
              name="sport"
              placeholder="e.g. Cricket, Football, Rugby, Athletics"
              value={form.sport}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Position / Specialty</label>
            <input
              name="position"
              placeholder="e.g. Right-Arm Fast Bowler, Opening Batsman, Forward"
              value={form.position}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Short Bio</label>
            <textarea
              name="bio"
              placeholder="Brief description of your background and achievements in this sport..."
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
          >
            {saving ? "Creating Sport Profile..." : "Save Sport Profile"}
          </button>
        </form>
      )}

      {profiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 p-8 space-y-3">
          
          <p className="text-gray-700 font-bold">
            You haven't added any sport profiles yet.
          </p>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Click "+ Add Sport" above to create your first sport profile (e.g.
            Cricket, Football).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                      {p.sport}
                    </h3>
                    {p.position && (
                      <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {p.position}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {p.bio && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                    {p.bio}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Link
                  to={`/account/sports/${p.id}`}
                  className="w-full inline-flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all"
                >
                  <span>Manage Achievements, Clubs & Teams</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SportProfilesPage;
