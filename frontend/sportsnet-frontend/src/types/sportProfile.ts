export interface SportProfileRequest {
  sport: string;
  position?: string;
  bio?: string;
}

export interface SportProfileResponse {
  id: string;
  userId: string;
  sport: string;
  position: string | null;
  bio: string | null;
}

