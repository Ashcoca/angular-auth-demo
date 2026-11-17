import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface LoginResponse {
  token: string;
}

export interface Me {
  email: string;
  issuedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = 'http://localhost:3000/api';

  /** The single source of truth for the session token. */
  private readonly token = signal<string | null>(null);

  /** Derived state other parts of the app can react to. */
  readonly isLoggedIn = computed(() => this.token() !== null);

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.token.set(response.token)));
  }

  /** Read by the interceptor on every outgoing request. */
  getAccessToken(): string | null {
    return this.token();
  }

  fetchMe() {
    return this.http.get<Me>(`${this.apiUrl}/me`);
  }

  logout(): void {
    this.token.set(null);
    this.router.navigate(['/login']);
  }
}
