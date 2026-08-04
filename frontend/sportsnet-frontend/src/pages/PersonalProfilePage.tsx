import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import type { PersonalProfileResponse, PersonalProfileRequest } from "../types/personalProfile";
import { api, API_ORIGIN } from "../api/axios";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const profileSchema = z.object({
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || new Date(val).getTime() < startOfToday().getTime(), {
      message: "Date of Birth must be in the past!",
    }),
  heightCm: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().optional()),
  weightKg: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().optional()),
  country: z.string().optional(),
  location: z.string().optional(),
  contactVisible: z.boolean().optional(),
});

type ProfileFormValues = z.input<typeof profileSchema>;
type ProfileFormOutput = z.output<typeof profileSchema>;

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white";
const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider";
const errorClass = "text-red-500 text-xs mt-1 font-medium";

const PersonalProfilePage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<PersonalProfileResponse | null>(null);
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
      .get<PersonalProfileResponse>(`/profile/${user.userId}`)
      .then((res) => {
        setProfile(res.data);
        reset({
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

    const payload: PersonalProfileRequest = {
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth : null,
      heightCm: data.heightCm ?? null,
      weightKg: data.weightKg ?? null,
      country: data.country || null,
      location: data.location || null,
      contactVisible: !!data.contactVisible,
    };

    try {
      const res = await api.put<PersonalProfileResponse>("/profile/me", payload);
      setProfile(res.data);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save personal profile");
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
      const res = await api.post<PersonalProfileResponse>(
        "/profile/me/image",
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
        <div className="h-36 bg-white rounded-3xl shadow-sm" />
        <div className="h-64 bg-white rounded-3xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group shrink-0">
          {profile?.profileImageUrl ? (
            <img
              src={`${API_ORIGIN}${profile.profileImageUrl}`}
              alt={user?.fullName}
              className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-blue-50"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-blue-800 flex items-center justify-center text-white font-extrabold text-3xl shadow-md">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 truncate">{user?.fullName}</h1>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 w-fit mx-auto sm:mx-0">
              Verified Player
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {profile?.location && profile?.country ? `${profile.location}, ${profile.country}` : "Personal Details"}
          </p>
          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-medium text-gray-600">
            {profile?.age && <span>{profile.age} Yrs</span>}
            {profile?.heightCm && <span>{profile.heightCm} cm</span>}
            {profile?.weightKg && <span>{profile.weightKg} kg</span>}
          </div>
        </div>

        <button
          onClick={() => setEditing((prev) => !prev)}
          className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          {editing ? "Close Form" : profile ? "Edit Profile" : "Setup Profile"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-xs font-bold text-red-500 hover:text-red-700">Dismiss</button>
        </div>
      )}

      {/* Quick Image Upload Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-400">Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={!imageFile || uploadingImage}
            className="w-full sm:w-auto text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl disabled:opacity-40 transition-all shadow-sm"
          >
            {uploadingImage ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      </div>

      {/* View Mode Details */}
      {!editing && profile && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Age</p>
              <p className="font-bold text-gray-900">{profile.age ? `${profile.age} Years` : "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Height</p>
              <p className="font-bold text-gray-900">{profile.heightCm ? `${profile.heightCm} cm` : "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Weight</p>
              <p className="font-bold text-gray-900">{profile.weightKg ? `${profile.weightKg} kg` : "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Country</p>
              <p className="font-bold text-gray-900">{profile.country || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location / City</p>
              <p className="font-bold text-gray-900">{profile.location || "—"}</p>
            </div>
            {profile.telephone && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="font-bold text-gray-900">{profile.telephone}</p>
              </div>
            )}
            {profile.email && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-bold text-gray-900">{profile.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Mode Form */}
      {editing && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5"
        >
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            {profile ? "Edit Personal Details" : "Setup Personal Details"}
          </h2>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Height (cm)</label>
              <input
                type="number"
                step="0.1"
                {...register("heightCm")}
                placeholder="e.g. 175.5"
                className={inputClass}
              />
              {errors.heightCm && (
                <p className={errorClass}>{errors.heightCm.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("weightKg")}
                placeholder="e.g. 68.0"
                className={inputClass}
              />
              {errors.weightKg && (
                <p className={errorClass}>{errors.weightKg.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
            <div>
              <label className={labelClass}>Location / City</label>
              <input
                {...register("location")}
                placeholder="e.g. Kandy / Colombo"
                className={inputClass}
              />
              {errors.location && (
                <p className={errorClass}>{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                {...register("contactVisible")}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Display phone and email on my public profile</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile Details"}
            </button>
            {profile && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all text-sm"
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

export default PersonalProfilePage;
