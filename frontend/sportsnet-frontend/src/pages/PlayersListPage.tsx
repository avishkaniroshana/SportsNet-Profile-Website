import { useEffect, useMemo, useState } from "react";
import { api, API_ORIGIN } from "../api/axios";
import type {
  ProfileSummaryResponse,
  PageResponse,
} from "../types/profileSummary";
import type { PersonalProfileResponse } from "../types/personalProfile";
import type { SportProfileResponse } from "../types/sportProfile";
import type { Achievement, ClubDetail, EducationalDetail, TeamDetail } from "../types/details";

const AVATAR_STYLES = [
  { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  { bg: "bg-cyan-50", text: "text-cyan-600", dot: "bg-cyan-500" },
];

const avatarStyle = (name: string) => {
  const index = (name.charCodeAt(0) || 0) % AVATAR_STYLES.length;
  return AVATAR_STYLES[index];
};

interface SportProfileBundle {
  profile: SportProfileResponse;
  achievements: Achievement[];
  clubs: ClubDetail[];
  teams: TeamDetail[];
}

const PlayersListPage = () => {
  const [players, setPlayers] = useState<ProfileSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");

  // State for public player profile modal/drawer
  const [selectedPlayer, setSelectedPlayer] = useState<ProfileSummaryResponse | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalPersonal, setModalPersonal] = useState<PersonalProfileResponse | null>(null);
  const [modalEducation, setModalEducation] = useState<EducationalDetail[]>([]);
  const [modalBundles, setModalBundles] = useState<SportProfileBundle[]>([]);

  useEffect(() => {
    setLoading(true);

    api
      .get<PageResponse<ProfileSummaryResponse>>(
        `/profiles-summary?page=${page}&size=${size}`,
      )
      .then((res) => {
        setPlayers(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => setError("Failed to load players profile summary"))
      .finally(() => setLoading(false));
  }, [page, size]);

  const sports = useMemo(
    () => ["All", ...Array.from(new Set(players.map((p) => p.sport)))],
    [players],
  );

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const matchesSport = sportFilter === "All" || p.sport === sportFilter;
      const matchesSearch = p.fullName
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesSport && matchesSearch;
    });
  }, [players, sportFilter, search]);

  const handleOpenPlayerModal = async (player: ProfileSummaryResponse) => {
    setSelectedPlayer(player);
    setModalLoading(true);
    setModalPersonal(null);
    setModalEducation([]);
    setModalBundles([]);

    try {
      const [personalRes, eduRes, sportsRes] = await Promise.allSettled([
        api.get<PersonalProfileResponse>(`/profile/${player.userId}`),
        api.get<EducationalDetail[]>(`/education/${player.userId}`),
        api.get<SportProfileResponse[]>(`/sport-profiles/${player.userId}`),
      ]);

      if (personalRes.status === "fulfilled") setModalPersonal(personalRes.value.data);
      if (eduRes.status === "fulfilled") setModalEducation(eduRes.value.data);

      if (sportsRes.status === "fulfilled") {
        const bundles = await Promise.all(
          sportsRes.value.data.map(async (sp) => {
            const [achRes, clubRes, teamRes] = await Promise.allSettled([
              api.get<Achievement[]>(`/sport-profiles/${sp.id}/achievements`),
              api.get<ClubDetail[]>(`/sport-profiles/${sp.id}/clubs`),
              api.get<TeamDetail[]>(`/sport-profiles/${sp.id}/teams`),
            ]);
            return {
              profile: sp,
              achievements: achRes.status === "fulfilled" ? achRes.value.data : [],
              clubs: clubRes.status === "fulfilled" ? clubRes.value.data : [],
              teams: teamRes.status === "fulfilled" ? teamRes.value.data : [],
            };
          }),
        );
        setModalBundles(bundles);
      }
    } catch (err) {
      console.error("Failed to load player details", err);
    } finally {
      setModalLoading(false);
    }
  };

  const rangeStart = totalElements === 0 ? 0 : page * size + 1;
  const rangeEnd = Math.min(page * size + filtered.length, totalElements);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Players Summary</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Discover verified players and sports performers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search player by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {sports.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Sports" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm p-6 animate-pulse space-y-4 border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-3xl">🔍</div>
          <p className="text-gray-900 font-bold">No players found</p>
          <p className="text-gray-400 text-xs">
            Try adjusting your search query or sport filter.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => {
              const style = avatarStyle(p.fullName);
              const cardKey = `${p.userId}-${p.sportProfileId}`;
              return (
                <div
                  key={cardKey}
                  onClick={() => handleOpenPlayerModal(p)}
                  className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md hover:border-gray-200 transition-all border border-gray-100 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {p.profileImageUrl ? (
                          <img
                            src={`${API_ORIGIN}${p.profileImageUrl}`}
                            alt={p.fullName}
                            className="w-14 h-14 shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-gray-100"
                          />
                        ) : (
                          <div
                            className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-extrabold text-xl ${style.bg} ${style.text} shadow-sm`}
                          >
                            {p.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="font-extrabold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {p.fullName}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {p.sport.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/70 rounded-2xl p-3.5 border border-gray-100">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">
                          Age
                        </span>
                        <span className="font-bold text-gray-800">
                          {p.age ? `${p.age} Yrs` : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">
                          Country
                        </span>
                        <span className="font-bold text-gray-800 truncate block">
                          {p.country || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">
                          Height
                        </span>
                        <span className="font-bold text-gray-800">
                          {p.heightCm ? `${p.heightCm} cm` : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">
                          Weight
                        </span>
                        <span className="font-bold text-gray-800">
                          {p.weightKg ? `${p.weightKg} kg` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>View Full Profile</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500">
              Showing {rangeStart}-{rangeEnd} of{" "}
              <span className="font-bold text-gray-800">{totalElements}</span> players
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-100 transition-all"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      page === index
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                  disabled={page === totalPages - 1}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-100 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Public Player Profile Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                {selectedPlayer.profileImageUrl ? (
                  <img
                    src={`${API_ORIGIN}${selectedPlayer.profileImageUrl}`}
                    alt={selectedPlayer.fullName}
                    className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-2 ring-blue-50"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-800 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
                    {selectedPlayer.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">{selectedPlayer.fullName}</h2>
                  <span className="inline-block mt-0.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                     {selectedPlayer.sport}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {modalLoading ? (
              <div className="py-12 text-center text-gray-400 text-sm animate-pulse space-y-2">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading player details...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Personal Profile Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Physical & Location Stats</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">Age:</span>
                      <span className="font-bold text-gray-800">{modalPersonal?.age ? `${modalPersonal.age} Yrs` : "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Height:</span>
                      <span className="font-bold text-gray-800">{modalPersonal?.heightCm ? `${modalPersonal.heightCm} cm` : "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Weight:</span>
                      <span className="font-bold text-gray-800">{modalPersonal?.weightKg ? `${modalPersonal.weightKg} kg` : "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Country:</span>
                      <span className="font-bold text-gray-800">{modalPersonal?.country || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Location:</span>
                      <span className="font-bold text-gray-800">{modalPersonal?.location || "N/A"}</span>
                    </div>
                    {modalPersonal?.telephone && (
                      <div>
                        <span className="text-gray-400 block">Phone:</span>
                        <span className="font-bold text-gray-800">{modalPersonal.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Educational Details */}
                {modalEducation.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider"> Education</h3>
                    <div className="space-y-2">
                      {modalEducation.map((edu) => (
                        <div key={edu.id} className="border border-gray-100 rounded-xl p-3 text-xs bg-white">
                          <p className="font-bold text-gray-900">{edu.institutionName}</p>
                          {edu.description && <p className="text-gray-600 mt-0.5">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sports Profiles Bundles */}
                {modalBundles.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider"> Sports & Teams</h3>
                    {modalBundles.map(({ profile, achievements, clubs, teams }) => (
                      <div key={profile.id} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <h4 className="font-extrabold text-gray-900 text-sm">{profile.sport}</h4>
                          {profile.position && <span className="text-xs font-semibold text-blue-600">{profile.position}</span>}
                        </div>
                        {profile.bio && <p className="text-xs text-gray-600">{profile.bio}</p>}

                        {/* Clubs */}
                        {clubs.length > 0 && (
                          <div className="pt-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Clubs</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {clubs.map((c) => (
                                <span key={c.id} className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg">
                                  {c.clubName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Teams */}
                        {teams.length > 0 && (
                          <div className="pt-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Teams</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {teams.map((t) => (
                                <span key={t.id} className="text-xs font-medium px-2.5 py-1 bg-purple-50 text-blue-700 rounded-lg">
                                  {t.teamName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Achievements */}
                        {achievements.length > 0 && (
                          <div className="pt-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Achievements</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {achievements.map((a) => (
                                <span key={a.id} className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg">
                                   {a.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No additional sports added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersListPage;
