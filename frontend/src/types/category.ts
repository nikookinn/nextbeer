// Category Request DTO - Data to be sent to backend
export interface CategoryRequestDto {
  name: string;
  menuId: number;
}

// Category Response - Full data from backend
export interface CategoryResponse {
  categoryId: number;
  name: string;
  menuId: number;
}

// Category Simple Response - For simple lists
export interface CategorySimpleResponse {
  categoryId: number;
  name: string;
}

// Page Response - For pagination
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Form Data - For frontend form
export interface CategoryFormData {
  name: string;
  menuId: number;
}
