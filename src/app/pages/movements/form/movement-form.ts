import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovementService } from '../../../core/services/movement.service';
import { CategoryService } from '../../../core/services/category.service';
import {
  BalanceResponse,
  MovementCreate,
  MovementUpdate,
} from '../../../core/models/movement';
import { CategoryResponse, BudgetWarning } from '../../../core/models/category';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.scss',
})
export class MovementForm implements OnInit {
  private movementSvc = inject(MovementService);
  private categorySvc = inject(CategoryService);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEdit = false;
  movementId: number | null = null;
  categories: CategoryResponse[] = [];
  data: MovementCreate = {
    movement_category_id: 0,
    type: 'EXPENSE',
    amount: 0,
    description: '',
  };
  loading = false;
  budgetWarning: BudgetWarning | null = null;
  availableBalance: number | null = null;

  get projectedUsage(): number | null {
    if (!this.budgetWarning || !this.budgetWarning.budget || !this.data.amount) return null;
    return ((this.budgetWarning.total_expense + this.data.amount) / this.budgetWarning.budget) * 100;
  }

  onCategoryOrTypeChange(): void {
    this.budgetWarning = null;
    if (this.data.type === 'EXPENSE' && this.data.movement_category_id) {
      this.categorySvc.checkBudget(this.data.movement_category_id).subscribe({
        next: (w) => this.budgetWarning = w,
        error: () => this.budgetWarning = null,
      });
    }
  }

  get insufficientBalance(): boolean {
    return (
      !this.isEdit &&
      this.data.type === 'EXPENSE' &&
      this.availableBalance != null &&
      this.data.amount > this.availableBalance
    );
  }

  ngOnInit(): void {
    this.categorySvc.list().subscribe((c) => (this.categories = c));

    this.movementSvc.getBalance().subscribe({
      next: (res: BalanceResponse) => (this.availableBalance = res.balance),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.movementId = +id;
      this.movementSvc.get(+id).subscribe((m) => {
        this.data = {
          movement_category_id: m.movement_category_id,
          type: m.type,
          amount: m.amount,
          description: m.description,
        };
        this.onCategoryOrTypeChange();
      });
    }
  }

  submit(): void {
    if (!this.data.movement_category_id || this.data.amount <= 0) return;
    if (this.insufficientBalance) {
      this.snackBar.open('Fondos insuficientes para crear este gasto', 'Cerrar', { duration: 4000 });
      return;
    }
    if (this.data.type === 'EXPENSE' && this.projectedUsage != null && this.projectedUsage > 100) {
      this.snackBar.open('Presupuesto excedido para esta categoria', 'Cerrar', { duration: 4000 });
      return;
    }
    this.loading = true;

    if (this.isEdit && this.movementId) {
      const payload: MovementUpdate = {};
      if (this.data.movement_category_id)
        payload.movement_category_id = this.data.movement_category_id;
      if (this.data.type) payload.type = this.data.type;
      if (this.data.amount) payload.amount = this.data.amount;
      payload.description = this.data.description || null;

      this.movementSvc.update(this.movementId, payload).subscribe({
        next: () => {
          this.snackBar.open('Movimiento actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/movements']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.detail || 'Error al actualizar';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        },
      });
    } else {
      this.movementSvc.create(this.data).subscribe({
        next: () => {
          this.snackBar.open('Movimiento creado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/movements']);
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
