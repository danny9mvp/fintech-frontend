export interface MovementResponse {
  id: number;
  movement_category_id: number;
  category_name: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string | null;
  created_at: string;
}

export interface MovementCreate {
  movement_category_id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string | null;
}

export interface MovementUpdate {
  movement_category_id?: number;
  type?: 'INCOME' | 'EXPENSE';
  amount?: number;
  description?: string | null;
}

export interface MovementFilters {
  movement_type?: string;
  category_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
