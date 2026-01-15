import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../app.scss'],
})
export class Login {
  email = '';
  password = '';
  loading = false;

  constructor(private router: Router, private auth: Auth) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.loading = false;

        const token = response?.result?.token;

        if (token) {
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_response', JSON.stringify(response));
            }
          } catch (e) {
            console.warn('Could not persist auth response to localStorage', e);
          }

          this.router.navigate(['/inicio']);
        } else {
          alert('Authentication failed: invalid response');
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Login error', err);
        alert('Authentication failed. Please check your credentials and try again.');
      },
    });
  }
}
