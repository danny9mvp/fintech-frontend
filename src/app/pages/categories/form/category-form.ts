import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryCreate, CategoryUpdate } from '../../../core/models/category';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {
  private categorySvc = inject(CategoryService);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEdit = false;
  categoryId: number | null = null;
  data: CategoryCreate = { name: '', budget: null };
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryId = +id;
      this.categorySvc.get(+id).subscribe((c) => {
        this.data = { name: c.name, budget: c.budget };
      });
    }
  }

  submit(): void {
    if (!this.data.name) return;
    this.loading = true;

    if (this.isEdit && this.categoryId) {
      const payload: CategoryUpdate = {};
      if (this.data.name) payload.name = this.data.name;
      payload.budget = this.data.budget ?? null;

      this.categorySvc.update(this.categoryId, payload).subscribe({
        next: () => {
          this.snackBar.open('Categoria actualizada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.detail || 'Error al actualizar';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        },
      });
    } else {
      this.categorySvc.create(this.data).subscribe({
        next: () => {
          this.snackBar.open('Categoria creada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.detail || 'Error al crear';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        },
      });
    }
  }
}
