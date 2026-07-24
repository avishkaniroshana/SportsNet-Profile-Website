import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { SportsProfileResponse } from "../types/profile";
import type {
  EducationalDetail,
  ClubDetail,
  TeamDetail,
  Achievement,
} from "../types/details";

const PreviewPage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<SportsProfileResponse | null>(null);
  const [education, setEducation] = useState<EducationalDetail[]>([]);
  const [clubs, setClubs] = useState<ClubDetail[]>([]);
  const [teams, setTeams] = useState<TeamDetail[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    Promise.allSettled([
      api.get<SportsProfileResponse>(`/profiles/${user.userId}`),
      api.get<EducationalDetail[]>("/education/me"),
      api.get<ClubDetail[]>("/clubs/me"),
      api.get<TeamDetail[]>("/teams/me"),
      api.get<Achievement[]>("/achievements/me"),
    ]).then(([profileRes, eduRes, clubRes, teamRes, achRes]) => {
      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (eduRes.status === "fulfilled") setEducation(eduRes.value.data);
      if (clubRes.status === "fulfilled") setClubs(clubRes.value.data);
      if (teamRes.status === "fulfilled") setTeams(teamRes.value.data);
      if (achRes.status === "fulfilled") setAchievements(achRes.value.data);

      if (profileRes.status === "rejected") {
        setError("You haven't created your personal profile yet.");
      }

      setLoading(false);
    });
  }, [user]);

  if (loading) return <div>Loading preview...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-1">{user?.fullName}</h1>
        {profile && (
          <p className="text-gray-500">
            {profile.sport}
            {profile.position ? ` • ${profile.position}` : ""}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Personal Details */}
      {profile && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-3 border-b pb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <p>
              <span className="font-semibold">Sport:</span> {profile.sport}
            </p>
            <p>
              <span className="font-semibold">Position:</span>{" "}
              {profile.position || "-"}
            </p>
            <p>
              <span className="font-semibold">Age:</span> {profile.age ?? "-"}
            </p>
            <p>
              <span className="font-semibold">Height:</span>{" "}
              {profile.heightCm ? `${profile.heightCm} cm` : "-"}
            </p>
            <p>
              <span className="font-semibold">Weight:</span>{" "}
              {profile.weightKg ? `${profile.weightKg} kg` : "-"}
            </p>
            <p>
              <span className="font-semibold">Country:</span>{" "}
              {profile.country || "-"}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {profile.location || "-"}
            </p>
            {profile.telephone && (
              <p>
                <span className="font-semibold">Telephone:</span>{" "}
                {profile.telephone}
              </p>
            )}
            {profile.email && (
              <p>
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
            )}
          </div>
          {profile.bio && (
            <p className="text-sm text-gray-600 mt-3">
              <span className="font-semibold">Bio:</span> {profile.bio}
            </p>
          )}
        </section>
      )}

      {/* Educational Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-2">
          Educational Details
        </h2>
        {education.length === 0 ? (
          <p className="text-gray-500 text-sm">No records added yet.</p>
        ) : (
          <div className="space-y-3">
            {education.map((item) => (
              <div key={item.id}>
                <p className="font-semibold">{item.institutionName}</p>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {item.startDate || "?"} - {item.endDate || "Present"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Club Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-2">Clubs</h2>
        {clubs.length === 0 ? (
          <p className="text-gray-500 text-sm">No records added yet.</p>
        ) : (
          <div className="space-y-3">
            {clubs.map((item) => (
              <div key={item.id}>
                <p className="font-semibold">{item.clubName}</p>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {item.startDate || "?"} - {item.endDate || "Present"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Team Details */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-2">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-500 text-sm">No records added yet.</p>
        ) : (
          <div className="space-y-3">
            {teams.map((item) => (
              <div key={item.id}>
                <p className="font-semibold">{item.teamName}</p>
                {item.details && (
                  <p className="text-sm text-gray-600">{item.details}</p>
                )}
                <p className="text-xs text-gray-400">
                  {item.startDate || "?"} - {item.endDate || "Present"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Achievements */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-2">Achievements</h2>
        {achievements.length === 0 ? (
          <p className="text-gray-500 text-sm">No records added yet.</p>
        ) : (
          <div className="space-y-3">
            {achievements.map((item) => (
              <div key={item.id}>
                <p className="font-semibold">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PreviewPage;
