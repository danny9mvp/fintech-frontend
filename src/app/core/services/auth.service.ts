import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  RefreshRequest,
  LogoutRequest,
  UserResponse,
  ProfileUpdate,
  PasswordUpdate,
} from '../models/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
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

  refreshToken(): Observable<TokenResponse> {
    const refresh_token = this.getRefreshToken();
    const body: RefreshRequest = { refresh_token: refresh_token ?? '' };
    return this.http.post<TokenResponse>('/auth/refresh', body).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout(): Observable<void> {
    const refresh_token = this.getRefreshToken();
    const body: LogoutRequest = { refresh_token: refresh_token ?? '' };
    return this.http.post<void>('/auth/logout', body).pipe(
      tap(() => this.clearSession()),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  updatePassword(data: PasswordUpdate): Observable<UserResponse> {
    return this.http.patch<UserResponse>('/users/me', data);
  }

  updateProfile(data: ProfileUpdate): Observable<UserResponse> {
    return this.http.patch<UserResponse>('/users/me', data).pipe(
      tap((user) => sessionStorage.setItem(this.USER_KEY, JSON.stringify(user)))
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  private setSession(res: TokenResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, res.access_token);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, res.refresh_token);
  }
}