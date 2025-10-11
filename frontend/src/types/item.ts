export interface ItemFormData {
  name: string;
  price: string; // Keep as string in form, will be sent as BigDecimal to backend
  description: string;
  categoryId: number;
  itemImage?: File;
  removeImage?: boolean;
  variants?: ItemVariantFormData[];
  tagIds?: number[];
}

export interface ItemVariantFormData {
  id?: number; // Optional for new variants
  name: string;
  price: string; // String for form input
}

export interface ItemRequestDto {
  name: string;
  price: number; // Number for backend
  description: string;
  categoryId: number; // Backend expects Long but JS uses number
  itemImage?: File;
  variants?: ItemVariantRequestDto[];
  tagIds?: number[]; // Backend expects Long[] but JS uses number[]
  removeImage?: boolean;
}

export interface ItemVariantRequestDto {
  id?: number; // Optional for new variants, backend Long
  name: string;
  price: number;
}

export interface ItemResponseDto {
  itemId: number; // Backend Long
  name: string;
  price: number; // Backend BigDecimal
  description: string;
  imageUrl?: string;
  displayOrder: number; // Backend Integer
  itemTagResponses?: ItemTagResponse[];
  itemVariantResponses?: ItemVariantResponse[];
}

export interface ItemVariantResponse {
  id: number; // Backend Long
  name: string;
  price: number; // Backend BigDecimal
}

export interface ItemTagResponse {
  id: number; // Backend Long
  name: string;
}

export interface ItemOrderRequestDto {
  itemId: number;
  displayOrder: number;
}

// For Drag & Drop
export interface DragEndEvent {
  active: {
    id: string | number;
  };
  over: {
    id: string | number;
  } | null;
}

export interface SortableItemData {
  itemId: number;
  displayOrder: number;
}
