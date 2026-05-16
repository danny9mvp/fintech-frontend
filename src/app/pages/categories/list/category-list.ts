import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryResponse } from '../../../core/models/category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit {
  private categorySvc = inject(CategoryService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  columns = ['name', 'budget', 'actions'];
  categories: CategoryResponse[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.categorySvc.list().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  create(): void {
    this.router.navigate(['/categories/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/categories', id]);
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta categoria?')) return;
    this.categorySvc.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Categoria eliminada', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        const msg = err.error?.detail || 'Error al eliminar';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      },
    });
  }
}
