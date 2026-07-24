export interface SportsProfileRequest {
  sport: string;
  position?: string;
  bio?: string;
  dateOfBirth?: string; // "YYYY-MM-DD"
  heightCm?: number;
  weightKg?: number;
  country?: string;
  location?: string;
//   profileImageUrl?: string;
  contactVisible: boolean;
}

export interface SportsProfileResponse {
  userId: string;
  fullName: string;
  sport: string;
  position: string | null;
  bio: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  country: string | null;
  location: string | null;
//   profileImageUrl: string | null;
  telephone: string | null;
  email: string | null;
}
