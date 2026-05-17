import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshSubject = new BehaviorSubject<string | null>(null);

const AUTH_SKIP = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const authReq = addToken(req, authService.getToken());

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !isSkipUrl(req.url)) {
        return handle401(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(
  req: HttpRequest<unknown>,
  token: string | null
): HttpRequest<unknown> {
  if (!token) return req;
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function isSkipUrl(url: string): boolean {
  return AUTH_SKIP.some((path) => url.includes(path));
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshSubject.next(res.access_token);
        return next(addToken(req, res.access_token));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.clearSession();
        return throwError(() => err);
      })
    );
  }

  return refreshSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addToken(req, token!)))
  );
}
