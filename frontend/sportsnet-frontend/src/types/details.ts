export interface EducationalDetail {
  id: string;
  institutionName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface EducationalDetailRequest {
  institutionName: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ClubDetail {
  id: string;
  sportProfileId: string;
  clubName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface ClubDetailRequest {
  clubName: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface TeamDetail {
  id: string;
  sportProfileId: string;
  teamName: string;
  details?: string;
  startDate?: string;
  endDate?: string;
}

export interface TeamDetailRequest {
  teamName: string;
  details?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Achievement {
  id: string;
  sportProfileId: string;
  title: string;
  description?: string;
}

export interface AchievementRequest {
  title: string;
  description?: string;
}
