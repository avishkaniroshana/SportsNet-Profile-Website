export interface ProfileSummaryResponse {
  userId: string;
  sportProfileId: string;
  fullName: string;
  sport: string;
  dateOfBirth?: string | null;
  heightCm: number | null;
  weightKg: number | null;
  country: string | null;
  profileImageUrl: string | null;
  age: number | null;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
