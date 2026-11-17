import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  // Demo
  // The form model: a plain writable signal. This IS your data.
  protected readonly loginModel = signal({ email: '', password: '' });

  // Demo
  // form() wraps the model in a field tree and wires up the schema.
  protected readonly loginForm = form(this.loginModel, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, {
      message: 'Password needs at least 8 characters',
    });
  });

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault(); // prevent page reload

    if (this.loginForm().invalid()) {
      return; // validation already showed the user what is wrong
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginModel();

    this.auth.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Login failed');
        this.isSubmitting.set(false);
      },
    });
  }
}
