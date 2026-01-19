import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { BodyUser, BodyUserResp } from '../models/user.interface';

type LoginResponse = {
  message: string;
  result: {
    token: string;
  };
};

// Ajuste conforme o payload real do seu JWT
type JwtPayload = {
  id?: string;
  username?: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/user`;

  private readonly isBrowser: boolean;

  private readonly _isLoggedIn: BehaviorSubject<boolean>;
  public readonly isLoggedIn$: Observable<boolean>;

  // Padroniza as chaves (evita string solta pelo projeto)
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly ACCOUNT_ID_KEY = 'account_id';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this._isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
    this.isLoggedIn$ = this._isLoggedIn.asObservable();
  }

  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(AuthService.TOKEN_KEY);
  }

  // Decodifica o payload do JWT (base64url) no browser
  private decodeJwtPayload(token: string): JwtPayload | null {
    if (!this.isBrowser) return null;

    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Corrige padding do base64, quando necessário
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

      const jsonPayload = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth`, { email, password })
      .pipe(
        tap((response) => {
          if (!this.isBrowser) return;

          const token = response.result?.token;
          if (!token) {
            console.warn('Login sem token em response.result.token');
            return;
          }

          // Salva token
          localStorage.setItem(AuthService.TOKEN_KEY, token);

          // Extrai e salva account_id do JWT (payload.id)
          const payload = this.decodeJwtPayload(token);
          const accountId = payload?.id;

          if (typeof accountId === 'string' && accountId.trim().length > 0) {
            localStorage.setItem(AuthService.ACCOUNT_ID_KEY, accountId);
          } else {
            localStorage.removeItem(AuthService.ACCOUNT_ID_KEY);
            console.warn('JWT sem payload.id (account_id não foi salvo)');
          }

          this._isLoggedIn.next(true);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.ACCOUNT_ID_KEY);
    }
    this._isLoggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  // Útil para outros MFEs/services
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  // Útil para outros MFEs/services (ex: transações)
  getAccountId(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(AuthService.ACCOUNT_ID_KEY);
  }

  postUser(userData: BodyUser): Observable<BodyUserResp> {
    return this.http.post<BodyUserResp>(`${this.apiUrl}`, userData);
  }
}
