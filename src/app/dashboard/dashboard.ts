import { Component, computed, inject, signal } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly me = signal<{ email: string; issuedAt: string } | null>(
    null,
  );

  /** The raw token, split into its three dot-separated parts. */
  protected readonly tokenParts = computed(() => {
    const token = this.auth.getAccessToken();
    return token ? token.split('.') : [];
  });

  /** The payload, base64url-decoded so the audience can read the claims. */
  protected readonly tokenPayload = computed(() => {
    const token = this.auth.getAccessToken();
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return null;
    }
  });

  constructor() {
    // A plain GET to /api/me — the interceptor attaches the JWT for us.
    this.auth.fetchMe().subscribe({
      next: (data) => {
        this.me.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load your profile.');
        this.loading.set(false);
      },
    });
  }
}
