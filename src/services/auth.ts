import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BodyUser, BodyUserResp } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/user`;
  private isBrowser: boolean;
  private readonly _isLoggedIn: BehaviorSubject<boolean>;
  public readonly isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this._isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());

    this.isLoggedIn$ = this._isLoggedIn.asObservable();
  }

  private hasToken(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth`, { email, password }).pipe(
      tap((response: any) => {
        const token = response.result?.token;

        if (token && this.isBrowser) {
          localStorage.setItem('auth_token', token);
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
    }
    this._isLoggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  postUser(userData: BodyUser) {
    return this.http.post<BodyUserResp>(`${this.apiUrl}`, userData);
  }
}
