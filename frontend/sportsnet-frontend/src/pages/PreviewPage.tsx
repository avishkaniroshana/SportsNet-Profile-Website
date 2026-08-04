import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api, API_ORIGIN } from "../api/axios";
import type { PersonalProfileResponse } from "../types/personalProfile";
import type { SportProfileResponse } from "../types/sportProfile";
import type {
  Achievement,
  ClubDetail,
  EducationalDetail,
  TeamDetail,
} from "../types/details";

interface SportProfileBundle {
  profile: SportProfileResponse;
  achievements: Achievement[];
  clubs: ClubDetail[];
  teams: TeamDetail[];
}

const PreviewPage = () => {
  const { user } = useAuth();

  const [personal, setPersonal] = useState<PersonalProfileResponse | null>(
    null,
  );
  const [education, setEducation] = useState<EducationalDetail[]>([]);
  const [sportBundles, setSportBundles] = useState<SportProfileBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    Promise.allSettled([
      api.get<PersonalProfileResponse>(`/profile/${user.userId}`),
      api.get<EducationalDetail[]>("/education/me"),
      api.get<SportProfileResponse[]>("/sport-profiles/me"),
    ]).then(async ([personalRes, eduRes, sportsRes]) => {
      if (personalRes.status === "fulfilled")
        setPersonal(personalRes.value.data);
      if (eduRes.status === "fulfilled") setEducation(eduRes.value.data);

      if (personalRes.status === "rejected") {
        setError("You haven't set up your personal profile details yet.");
      }

      if (sportsRes.status === "fulfilled") {
        const profiles = sportsRes.value.data;
        const bundles = await Promise.all(
          profiles.map(async (profile) => {
            const [achRes, clubRes, teamRes] = await Promise.allSettled([
              api.get<Achievement[]>(
                `/sport-profiles/${profile.id}/achievements`,
              ),
              api.get<ClubDetail[]>(`/sport-profiles/${profile.id}/clubs`),
              api.get<TeamDetail[]>(`/sport-profiles/${profile.id}/teams`),
            ]);
            return {
              profile,
              achievements:
                achRes.status === "fulfilled" ? achRes.value.data : [],
              clubs: clubRes.status === "fulfilled" ? clubRes.value.data : [],
              teams: teamRes.status === "fulfilled" ? teamRes.value.data : [],
            };
          }),
        );
        setSportBundles(bundles);
      }

      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-40 bg-white rounded-3xl shadow-sm" />
        <div className="h-64 bg-white rounded-3xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Banner */}
      <div className="border border-gray-200 text-gray-900 rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        {personal?.profileImageUrl ? (
          <img
            src={`${API_ORIGIN}${personal.profileImageUrl}`}
            alt={user?.fullName}
            className="w-24 h-24 rounded-full object-cover shadow-lg ring-4 ring-white/20 shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-3xl shadow-lg ring-4 ring-white/20 shrink-0">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="space-y-2 text-center sm:text-left z-10">
          <h1 className="text-3xl font-extrabold">{user?.fullName}</h1>
          <p className="text-blue-400 text-sm font-medium">
            {sportBundles.length > 0
              ? sportBundles.map((b) => b.profile.sport).join(" • ")
              : "No sports registered yet"}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            {personal?.location && (
              <span className="bg-white/10 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-xs">
                {personal.location}, {personal.country}
              </span>
            )}
            {personal?.age && (
              <span className="bg-white/10 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-xs">
                {personal.age} Years Old
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-gray-200 text-gray-800 rounded-2xl p-4 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Personal Details Section */}
      {personal && (
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span>Personal Profile Overview</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Age
              </p>
              <p className="font-bold text-gray-800">{personal.age ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Height
              </p>
              <p className="font-bold text-gray-800">
                {personal.heightCm ? `${personal.heightCm} cm` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Weight
              </p>
              <p className="font-bold text-gray-800">
                {personal.weightKg ? `${personal.weightKg} kg` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Country
              </p>
              <p className="font-bold text-gray-800">
                {personal.country || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Location
              </p>
              <p className="font-bold text-gray-800">
                {personal.location || "—"}
              </p>
            </div>
            {personal.telephone && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Phone
                </p>
                <p className="font-bold text-gray-800">{personal.telephone}</p>
              </div>
            )}
            {personal.email && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Email
                </p>
                <p className="font-bold text-gray-800">{personal.email}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Educational Details Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <span>Educational Background</span>
        </h2>
        {education.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No educational records added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {education.map((item) => (
              <div
                key={item.id}
                className="border-l-4 border-l-blue-600 bg-gray-50/50 rounded-2xl p-4"
              >
                <h3 className="font-bold text-gray-900 text-sm">
                  {item.institutionName}
                </h3>
                {item.description && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {item.description}
                  </p>
                )}
                <p className="text-[11px] font-semibold text-gray-400 mt-2">
                  {item.startDate || "?"} — {item.endDate || "Present"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Per Sport Sections */}
      {sportBundles.map(({ profile, achievements, clubs, teams }) => (
        <section
          key={profile.id}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6"
        >
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <span>{profile.sport}</span>
              </h2>
              {profile.position && (
                <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {profile.position}
                </span>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl italic">
              "{profile.bio}"
            </p>
          )}

          {/* Clubs */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
               Clubs Represented
            </h3>
            {clubs.length === 0 ? (
              <p className="text-gray-400 text-xs">
                No club records added for this sport.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clubs.map((c) => (
                  <div
                    key={c.id}
                    className="border border-gray-100 rounded-2xl p-3.5 bg-gray-50/50"
                  >
                    <p className="font-bold text-xs text-gray-900">
                      {c.clubName}
                    </p>
                    {c.description && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {c.description}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 font-medium mt-1">
                      {c.startDate || "?"} — {c.endDate || "Present"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teams */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              Teams Played For
            </h3>
            {teams.length === 0 ? (
              <p className="text-gray-400 text-xs">
                No team records added for this sport.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className="border border-gray-100 rounded-2xl p-3.5 bg-purple-50/30"
                  >
                    <p className="font-bold text-xs text-gray-600">
                      {t.teamName}
                    </p>
                    {t.details && (
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {t.details}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-600 font-medium mt-1">
                      {t.startDate || "?"} — {t.endDate || "Present"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              Achievements & Trophies
            </h3>
            {achievements.length === 0 ? (
              <p className="text-gray-400 text-xs">
                No achievements added for this sport.
              </p>
            ) : (
              <div className="space-y-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="border border-gray-100 bg-gray-50/40 rounded-2xl p-3.5"
                  >
                    <p className="font-bold text-xs text-gray-600">
                      {a.title}
                    </p>
                    {a.description && (
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {a.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PreviewPage;
