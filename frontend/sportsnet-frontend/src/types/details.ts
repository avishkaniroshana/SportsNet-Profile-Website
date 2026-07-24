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
  startDate?: string;
  endDate?: string;
}

export interface ClubDetail {
  id: string;
  clubName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}
export interface ClubDetailRequest {
  clubName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface TeamDetail {
  id: string;
  teamName: string;
  details?: string;
  startDate?: string;
  endDate?: string;
}
export interface TeamDetailRequest {
  teamName: string;
  details?: string;
  startDate?: string;
  endDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
}
export interface AchievementRequest {
  title: string;
  description?: string;
}
