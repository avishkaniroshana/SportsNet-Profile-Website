import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import type {
  SportProfileRequest,
  SportProfileResponse,
} from "../types/sportProfile";

import TeamDetailsPage from "./TeamDetailsPage";
import AchievementsPage from "./AchievementsPage";
import ClubDetailsPage from "./ClubDetailsPage";

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white";
const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider";

type Tab = "info" | "achievements" | "clubs" | "teams";

const tabs: { key: Tab; label: string; }[] = [
  { key: "info", label: "Sport Info" },
  { key: "achievements", label: "Achievements"},
  { key: "clubs", label: "Clubs" },
  { key: "teams", label: "Teams"},
];

const SportProfileDetailPage = () => {
  const { sportProfileId } = useParams<{ sportProfileId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<SportProfileResponse | null>(null);
  const [form, setForm] = useState<SportProfileRequest>({
    sport: "",
    position: "",
    bio: "",
  });
  const [tab, setTab] = useState<Tab>("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sportProfileId) return;
    setLoading(true);
    api
      .get<SportProfileResponse[]>("/sport-profiles/me")
      .then((res) => {
        const found = res.data.find((p) => p.id === sportProfileId);
        if (!found) {
          setError("Sport profile not found");
          return;
        }
        setProfile(found);
        setForm({
          sport: found.sport,
          position: found.position ?? "",
          bio: found.bio ?? "",
        });
      })
      .catch(() => setError("Failed to load sport profile"))
      .finally(() => setLoading(false));
  }, [sportProfileId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await api.put<SportProfileResponse>(
        `/sport-profiles/${sportProfileId}`,
        form,
      );
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this sport profile? Its achievements, clubs, and teams will be removed.",
      )
    )
      return;
    try {
      await api.delete(`/sport-profiles/${sportProfileId}`);
      navigate("/account/sports");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-28 bg-white rounded-3xl shadow-sm" />
        <div className="h-64 bg-white rounded-3xl shadow-sm" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4">
          {error || "Sport profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            
            <h1 className="text-2xl font-extrabold text-gray-900">{profile.sport}</h1>
          </div>
          {profile.position && (
            <p className="text-sm font-semibold text-blue-700 mt-1">{profile.position}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
        >
          Delete Sport Profile
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all border-b-2 ${
              tab === t.key
                ? "border-blue-600 text-blue-700 bg-blue-50/50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-xs font-bold text-red-500 hover:text-red-700">Dismiss</button>
        </div>
      )}

      {/* Tab Contents */}
      {tab === "info" && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Sport Information
          </h2>

          <div>
            <label className={labelClass}>Sport Name *</label>
            <input
              name="sport"
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
              value={form.position}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Bio / Summary</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
          >
            {saving ? "Saving Changes..." : "Save Sport Info"}
          </button>
        </form>
      )}

      {tab === "achievements" && (
        <AchievementsPage sportProfileId={profile.id} />
      )}
      {tab === "clubs" && <ClubDetailsPage sportProfileId={profile.id} />}
      {tab === "teams" && <TeamDetailsPage sportProfileId={profile.id} />}
    </div>
  );
};

export default SportProfileDetailPage;
