export interface CampaignFormData {
  name: string;
  campaignImage?: File;
  removeImage?: boolean;
}

export interface CampaignResponse {
  campaignId: number;
  name: string;
  imageUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
