import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  data: RegisterRequest = {
    email: '',
    password: '',
    username: '',
    firstname: '',
    middlename: '',
    lastname: '',
    second_lastname: '',
  };
  confirmPassword = '';
  loading = false;

  submit(): void {
    if (this.data.password !== this.confirmPassword) {
      this.snackBar.open('Las contrasenas no coinciden', 'Cerrar', { duration: 3000 });
      return;
    }
    this.loading = true;
    this.auth.register(this.data).subscribe({
      next: () => {
        this.auth.me().subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.detail || 'Error al registrarse';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      },
    });
  }
}
