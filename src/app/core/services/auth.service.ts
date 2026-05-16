import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from '../models/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'current_user';

  login(data: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('/auth/login', data)
      .pipe(tap((res) => this.setSession(res)));
  }

  register(data: RegisterRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('/auth/register', data)
      .pipe(tap((res) => this.setSession(res)));
  }

  me(): Observable<UserResponse> {
    return this.http.get<UserResponse>('/users/me').pipe(
      tap((user) => sessionStorage.setItem(this.USER_KEY, JSON.stringify(user)))
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setSession(res: TokenResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, res.access_token);
  }
}
