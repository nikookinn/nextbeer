export interface RestaurantRequestDto {
  name: string;
  about: string;
  phoneNumber: string;
  address: string;
  workingHours: string;
  email: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  latitude?: number;
  longitude?: number;
  removeImage?: boolean;
}

export interface RestaurantResponseDto {
  id: number;
  name: string;
  about: string;
  phoneNumber: string;
  address: string;
  workingHours: string;
  imageUrl?: string; // General restaurant image, uploaded by user
  email: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface RestaurantFormData extends RestaurantRequestDto {
  websiteImage?: File; // General restaurant image file
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
