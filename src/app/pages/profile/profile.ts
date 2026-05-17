import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/services/auth.service';
import { ProfileUpdate, PasswordUpdate, UserResponse } from '../../core/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  protected router = inject(Router);
  private snackBar = inject(MatSnackBar);

  user: UserResponse | null = null;
  data: ProfileUpdate = { email: '', username: '' };
  loading = false;
  passwordData: PasswordUpdate = { password: '' };
  confirmPassword = '';
  passwordLoading = false;

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (user) => {
        this.user = user;
        this.data = {
          email: user.email,
          username: user.username,
          middlename: user.middlename,
          second_lastname: user.second_lastname,
        };
      },
    });
  }

  submit(): void {
    if (!this.data.email || !this.data.username) return;
    this.loading = true;

    this.auth.updateProfile(this.data).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.detail || 'Error al actualizar perfil';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      },
    });
  }

  updatePassword(): void {
    if (!this.passwordData.password) return;
    this.passwordLoading = true;

    this.auth.updatePassword(this.passwordData).subscribe({
      next: () => {
        this.snackBar.open('Contrasena actualizada. Cerrando sesion...', 'Cerrar', { duration: 3000 });
        this.auth.logout().subscribe();
      },
      error: (err) => {
        this.passwordLoading = false;
        const msg = err.error?.detail || 'Error al actualizar contrasena';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      },
    });
  }
}