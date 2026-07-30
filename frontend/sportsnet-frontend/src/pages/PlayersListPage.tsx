import { useEffect, useMemo, useState } from "react";
// import { api } from "../api/axios";
import { api, API_ORIGIN } from "../api/axios";
import type {
  ProfileSummaryResponse,
  PageResponse,
} from "../types/profileSummary";

const AVATAR_STYLES = [
  { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  { bg: "bg-cyan-50", text: "text-cyan-600", dot: "bg-cyan-500" },
];

const avatarStyle = (name: string) => {
  const index = name.charCodeAt(0) % AVATAR_STYLES.length;
  return AVATAR_STYLES[index];
};

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

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
      .catch(() => setError("Failed to load players"))
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

  const rangeStart = totalElements === 0 ? 0 : page * size + 1;
  const rangeEnd = Math.min(page * size + filtered.length, totalElements);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Players</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse registered players across every sport
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-2.5 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-gray-400 text-lg">No players found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different name or sport filter
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => {
              const style = avatarStyle(p.fullName);
              return (
                <div
                  key={p.userId}
                  className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* <div
                        className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg ${style.bg} ${style.text}`}
                      >
                        {p.fullName.charAt(0).toUpperCase()}
                      </div> */}
                      {p.profileImageUrl ? (
                        <img
                          src={`${API_ORIGIN}${p.profileImageUrl}`}
                          alt={p.fullName}
                          className="w-12 h-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg ${style.bg} ${style.text}`}
                        >
                          {p.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {p.fullName}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-medium tracking-wide text-gray-500">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          />
                          {p.sport.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-gray-300 hover:text-gray-500 shrink-0"
                      aria-label="More options"
                    >
                      <MoreIcon />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 text-sm border-t border-gray-100 pt-3">
                    <p>
                      <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                        Age
                      </span>
                      <span className="font-semibold text-gray-800">
                        {p.age ? `${p.age} Yrs` : "-"}
                      </span>
                    </p>
                    <p>
                      <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                        Country
                      </span>
                      <span className="font-semibold text-gray-800">
                        {p.country ?? "-"}
                      </span>
                    </p>
                    <p>
                      <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                        Height
                      </span>
                      <span className="font-semibold text-gray-800">
                        {p.heightCm ? `${p.heightCm} cm` : "-"}
                      </span>
                    </p>
                    <p>
                      <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                        Weight
                      </span>
                      <span className="font-semibold text-gray-800">
                        {p.weightKg ? `${p.weightKg} kg` : "-"}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-sm text-gray-400">
              Showing {rangeStart}-{rangeEnd} of{" "}
              <span className="font-medium text-gray-600">{totalElements}</span>{" "}
              players
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  aria-label="Previous page"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-gray-600"
                >
                  <ChevronLeftIcon />
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      page === index
                        ? "bg-gray-800 text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, totalPages - 1))
                  }
                  disabled={page === totalPages - 1}
                  aria-label="Next page"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-gray-600"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayersListPage;
