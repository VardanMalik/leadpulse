export interface Lead {
  id: string;
  companyName: string;
  companyUrl: string | null;
  aiBrief: string | null;
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
