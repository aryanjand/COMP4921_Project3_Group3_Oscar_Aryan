import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SpinnerService } from '../core/services/spinner.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  authError: boolean;
  errorMessage: string;
  email: FormControl;
  password: FormControl;
  hide: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    public spinner: SpinnerService,
  ) {
    this.authError = false;
    this.errorMessage = '';
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, [Validators.required]);
    this.hide = true;
  }

  getErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'You must enter a username';
    }

    if (this.password.hasError('required')) {
      return 'Password is required';
    }

    return 'Invalid value';
  }

  signIn() {
    this.auth.signIn(this.email.value!, this.password.value!).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.authError = true;
        this.errorMessage = err.error.message;
      },
    });
  }
}
