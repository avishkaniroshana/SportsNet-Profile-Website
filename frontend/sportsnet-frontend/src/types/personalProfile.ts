export interface PersonalProfileRequest {
  dateOfBirth?: string | null; // "YYYY-MM-DD" or null
  heightCm?: number | null;
  weightKg?: number | null;
  country?: string | null;
  location?: string | null;
  contactVisible: boolean;
}

export interface PersonalProfileResponse {
  userId: string;
  fullName: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  country: string | null;
  location: string | null;
  profileImageUrl: string | null;
  telephone: string | null;
  email: string | null;
}
