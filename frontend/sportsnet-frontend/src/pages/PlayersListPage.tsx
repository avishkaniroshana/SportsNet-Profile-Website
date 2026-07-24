import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import type {
  ProfileSummaryResponse,
  PageResponse,
} from "../types/profileSummary";

const PlayersListPage = () => {
  const [players, setPlayers] = useState<ProfileSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);

    api
      .get<PageResponse<ProfileSummaryResponse>>(
        `/profiles-summary?page=${page}&size=${size}`,
      )
      .then((res) => {
        setPlayers(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setError("Failed to load players"))
      .finally(() => setLoading(false));
  }, [page, size]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg font-medium">Loading players...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Players</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {players.length === 0 ? (
        <p className="text-gray-500">No player profiles found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((p) => (
              <div
                key={p.userId}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {p.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-lg">{p.fullName}</p>
                    <p className="text-sm text-gray-500">{p.sport}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Age:</span>{" "}
                    {p.age ?? "-"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Country:</span>{" "}
                    {p.country ?? "-"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Height:</span>{" "}
                    {p.heightCm ?? "-"} cm
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Weight:</span>{" "}
                    {p.weightKg ?? "-"} kg
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={`w-10 h-10 rounded border font-medium transition
                ${
                  page === index
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayersListPage;
