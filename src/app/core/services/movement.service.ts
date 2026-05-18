import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BalanceResponse,
  MovementResponse,
  MovementCreate,
  MovementUpdate,
  MovementFilters,
  PaginatedResponse,
} from '../models/movement';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private http = inject(HttpClient);

  list(filters?: MovementFilters): Observable<PaginatedResponse<MovementResponse>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.page) params = params.set('page', filters.page);
      if (filters.page_size) params = params.set('page_size', filters.page_size);
      if (filters.movement_type) params = params.set('movement_type', filters.movement_type);
      if (filters.category_id) params = params.set('category_id', filters.category_id);
      if (filters.date_from) params = params.set('date_from', filters.date_from);
      if (filters.date_to) params = params.set('date_to', filters.date_to);
    }
    return this.http.get<PaginatedResponse<MovementResponse>>('/movements/', { params });
  }

  get(id: number): Observable<MovementResponse> {
    return this.http.get<MovementResponse>(`/movements/${id}`);
  }

  create(data: MovementCreate): Observable<MovementResponse> {
    return this.http.post<MovementResponse>('/movements/', data);
  }

  update(id: number, data: MovementUpdate): Observable<MovementResponse> {
    return this.http.patch<MovementResponse>(`/movements/${id}`, data);
  }

  getBalance(): Observable<BalanceResponse> {
    return this.http.get<BalanceResponse>('/movements/balance');
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/movements/${id}`);
  }
}
