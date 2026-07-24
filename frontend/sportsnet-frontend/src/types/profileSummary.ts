export interface ProfileSummaryResponse {
  userId: string;
  fullName: string;
  sport: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  country: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
