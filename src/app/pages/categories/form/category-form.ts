import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../core/services/category.service';
import { MovementService } from '../../../core/services/movement.service';
import { CategoryCreate, CategoryResponse, CategoryUpdate } from '../../../core/models/category';
import { BalanceResponse } from '../../../core/models/movement';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
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
  private movementSvc = inject(MovementService);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEdit = false;
  categoryId: number | null = null;
  data: CategoryCreate = { name: '', budget: null };
  loading = false;
  categories: CategoryResponse[] = [];
  availableBalance: number | null = null;

  get existingBudgetSum(): number {
    return this.categories.reduce((acc, c) => {
      if (this.isEdit && c.id === this.categoryId) return acc;
      return acc + Number(c.budget ?? 0);
    }, 0);
  }

  get remainingBudget(): number | null {
    if (this.availableBalance == null) return null;
    return this.availableBalance - this.existingBudgetSum;
  }

  get budgetExceedsBalance(): boolean {
    const raw = this.data.budget;
    if (raw == null || this.availableBalance == null || this.availableBalance <= 0) return false;

    const budget = Number(raw);
    if (budget <= 0) return false;

    return this.existingBudgetSum + budget > this.availableBalance;
  }

  ngOnInit(): void {
    this.movementSvc.getBalance().subscribe({
      next: (res: BalanceResponse) => (this.availableBalance = res.balance),
    });

    this.categorySvc.list().subscribe((c) => (this.categories = c));

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
    if (this.budgetExceedsBalance) {
      this.snackBar.open('Total category budgets would exceed your balance', 'Cerrar', { duration: 4000 });
      return;
    }
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
