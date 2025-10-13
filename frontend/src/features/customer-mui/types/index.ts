// Shared types for MUI Customer Interface
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface MenuData {
  id: string;
  name: string;
  description?: string;
  image?: string;
  categories?: CategoryData[];
}

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  items?: ItemData[];
}

export interface ItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tags?: string[];
}

export interface CampaignData {
  id: string;
  title: string;
  description?: string;
  image?: string;
  discount?: number;
}
