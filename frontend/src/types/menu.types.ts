export interface MenuFormData {
  name: string;
  menuImage?: File;
  removeImage?: boolean;
}

export interface MenuResponseDto {
  menuId: number;
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

export interface MenuListResponse {
  menus: MenuResponseDto[];
}
