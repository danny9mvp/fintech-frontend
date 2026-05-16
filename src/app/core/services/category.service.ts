import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CategoryResponse,
  CategoryCreate,
  CategoryUpdate,
  BudgetSummaryItem,
  BudgetWarning,
} from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  list(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>('/categories/');
  }

  get(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`/categories/${id}`);
  }

  create(data: CategoryCreate): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>('/categories/', data);
  }

  update(id: number, data: CategoryUpdate): Observable<CategoryResponse> {
    return this.http.patch<CategoryResponse>(`/categories/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/categories/${id}`);
  }

  budgetSummary(): Observable<BudgetSummaryItem[]> {
    return this.http.get<BudgetSummaryItem[]>('/categories/budget-summary');
  }

  checkBudget(id: number): Observable<BudgetWarning> {
    return this.http.get<BudgetWarning>(`/categories/${id}/check-budget`);
  }
}
