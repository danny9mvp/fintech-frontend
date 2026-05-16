export interface CategoryResponse {
  id: number;
  name: string;
  budget: number | null;
}

export interface CategoryCreate {
  name: string;
  budget?: number | null;
}

export interface CategoryUpdate {
  name?: string;
  budget?: number | null;
}

export interface BudgetSummaryItem {
  category_id: number;
  category_name: string;
  budget: number | null;
  total_expense: number;
  usage_percentage: number | null;
}

export interface BudgetWarning {
  category_id: number;
  category_name: string;
  budget: number | null;
  total_expense: number;
  usage_percentage: number | null;
  warning_level: string;
  message: string;
}
