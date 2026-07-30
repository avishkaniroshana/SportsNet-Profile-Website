import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import type { SportsProfileResponse } from "../types/profile";
import { api, API_ORIGIN } from "../api/axios";

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

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const errorClass = "text-red-500 text-xs mt-1";

const ProfilePage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<SportsProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setError("");
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await api.post<SportsProfileResponse>(
        "/profiles/me/image",
        formData,
      );
      setProfile(res.data);
      setImageFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-32 bg-white rounded-2xl shadow-sm" />
        <div className="h-64 bg-white rounded-2xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
        {profile?.profileImageUrl ? (
          <img
            src={`${API_ORIGIN}${profile.profileImageUrl}`}
            alt={user?.fullName}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user?.fullName}</h1>
          {profile && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                {profile.sport}
              </span>
              {profile.position && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {profile.position}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      {!editing && profile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Personal Details
            </h2>
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {profile.bio && (
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Age</p>
              <p className="font-medium text-gray-900">{profile.age ?? "-"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Height</p>
              <p className="font-medium text-gray-900">
                {profile.heightCm ? `${profile.heightCm} cm` : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Weight</p>
              <p className="font-medium text-gray-900">
                {profile.weightKg ? `${profile.weightKg} kg` : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Country</p>
              <p className="font-medium text-gray-900">
                {profile.country || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Location</p>
              <p className="font-medium text-gray-900">
                {profile.location || "-"}
              </p>
            </div>
            {profile.telephone && (
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Telephone</p>
                <p className="font-medium text-gray-900">{profile.telephone}</p>
              </div>
            )}
            {profile.email && (
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Email</p>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            {profile ? "Edit Profile" : "Update Your Profile"}
          </h2>

          <div>
            <label className={labelClass}>Profile Photo</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="text-sm text-blue-600"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || uploadingImage}
                className="text-sm font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg disabled:opacity-40"
              >
                {uploadingImage ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Sport</label>
            <input
              {...register("sport")}
              placeholder="e.g. Cricket, Rugby, Athletics"
              className={inputClass}
            />
            {errors.sport && (
              <p className={errorClass}>{errors.sport.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Position</label>
            <input
              {...register("position")}
              placeholder="e.g. Forward, Batsman, Sprinter"
              className={inputClass}
            />
            {errors.position && (
              <p className={errorClass}>{errors.position.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              {...register("bio")}
              placeholder="A short description about yourself"
              rows={3}
              className={inputClass}
            />
            {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className={inputClass}
            />
            {errors.dateOfBirth && (
              <p className={errorClass}>{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className={labelClass}>Height (cm)</label>
              <input
                type="number"
                {...register("heightCm")}
                placeholder="e.g. 175"
                className={inputClass}
              />
              {errors.heightCm && (
                <p className={errorClass}>{errors.heightCm.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className={labelClass}>Weight (kg)</label>
              <input
                type="number"
                {...register("weightKg")}
                placeholder="e.g. 68"
                className={inputClass}
              />
              {errors.weightKg && (
                <p className={errorClass}>{errors.weightKg.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className={labelClass}>Country</label>
              <input
                {...register("country")}
                placeholder="e.g. Sri Lanka"
                className={inputClass}
              />
              {errors.country && (
                <p className={errorClass}>{errors.country.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className={labelClass}>Location / City</label>
              <input
                {...register("location")}
                placeholder="e.g. Kandy"
                className={inputClass}
              />
              {errors.location && (
                <p className={errorClass}>{errors.location.message}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 pt-1">
            <input
              type="checkbox"
              {...register("contactVisible")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show my phone/email on my public profile
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {profile && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-white border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
