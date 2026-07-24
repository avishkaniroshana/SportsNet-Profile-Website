import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { SportsProfileResponse } from "../types/profile";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const profileSchema = z.object({
  sport: z.string().nonempty({ message: "Sport is required!" }),

  position: z.string().nonempty({ message: "Position is required!" }),
  bio: z.string().nonempty({ message: "Bio is required!" }),
  dateOfBirth: z
    .string()
    .nonempty({ message: "Date of Birth is required!" })
    .refine((val) => new Date(val).getTime() < startOfToday().getTime(), {
      message: "Date of Birth must be before today!",
    }),
  heightCm: z.coerce.number({ error: "Height must be a number!" }),
  weightKg: z.coerce.number({ error: "Weight must be a number!" }),
  country: z.string().nonempty({ message: "Country is required!" }),
  location: z.string().nonempty({ message: "Location is required!" }),
  contactVisible: z.boolean().optional(),
});

type ProfileFormValues = z.input<typeof profileSchema>;
type ProfileFormOutput = z.output<typeof profileSchema>;

const ProfilePage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<SportsProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!user) return;

    api
      .get<SportsProfileResponse>(`/profiles/${user.userId}`)
      .then((res) => {
        setProfile(res.data);

        reset({
          sport: res.data.sport,
          position: res.data.position ?? "",
          bio: res.data.bio ?? "",
          dateOfBirth: "",
          heightCm: res.data.heightCm ?? undefined,
          weightKg: res.data.weightKg ?? undefined,
          country: res.data.country ?? "",
          location: res.data.location ?? "",
          contactVisible: !!res.data.telephone || !!res.data.email,
        });
      })
      .catch(() => {
        setProfile(null);
        setEditing(true);
      })
      .finally(() => setLoading(false));
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormOutput> = async (data) => {
    setError("");
    setSaving(true);

    try {
      const res = await api.put("/profiles/me", data);
      setProfile(res.data);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold">{user?.fullName}</h1>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        {!editing && profile && (
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Sport:</span> {profile.sport}
            </p>

            <p>
              <span className="font-semibold">Position:</span>{" "}
              {profile.position || "-"}
            </p>

            <p>
              <span className="font-semibold">Bio:</span> {profile.bio || "-"}
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

            <button
              onClick={() => setEditing(true)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        )}

        {editing && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport
              </label>
              <input
                {...register("sport")}
                placeholder="e.g. Cricket, Rugby, Athletics"
                className="w-full border rounded px-3 py-2"
              />
              {errors.sport && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sport.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                {...register("position")}
                placeholder="e.g. Forward, Batsman, Sprinter"
                className="w-full border rounded px-3 py-2"
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                {...register("bio")}
                placeholder="A short description about yourself"
                className="w-full border rounded px-3 py-2"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full border rounded px-3 py-2"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  {...register("heightCm")}
                  placeholder="e.g. 175"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.heightCm && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heightCm.message}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  {...register("weightKg")}
                  placeholder="e.g. 68"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.weightKg && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.weightKg.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                {...register("country")}
                placeholder="e.g. Sri Lanka"
                className="w-full border rounded px-3 py-2"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location / City
              </label>
              <input
                {...register("location")}
                placeholder="e.g. Kandy"
                className="w-full border rounded px-3 py-2"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("contactVisible")} />
              Show my phone/email on my public profile
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

              {profile && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-300 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;






