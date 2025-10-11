// Customer-facing application types - Public API responses

export interface CustomerCampaign {
  campaignId: number;
  name: string;
  imageUrl: string;
}

export interface CustomerMenu {
  menuId: number;
  name: string;
  imageUrl: string;
}

export interface CustomerRestaurant {
  id: number;
  name: string;
  about: string;
  phoneNumber: string;
  address: string;
  workingHours: string;
  imageUrl: string;
  logoUrl?: string;
  email: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  latitude: number;
  longitude: number;
}

export interface CustomerCategory {
  categoryId: number;
  name: string;
  imageUrl: string;
}

export interface CustomerItem {
  itemId: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string[];
  variants: string[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Animation and UI related types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
}

export interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}
