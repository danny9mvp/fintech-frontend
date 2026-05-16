import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { MovementService } from '../../core/services/movement.service';
import { BudgetSummaryItem } from '../../core/models/category';
import { UserResponse } from '../../core/models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private categorySvc = inject(CategoryService);
  private movementSvc = inject(MovementService);
  private auth = inject(AuthService);

  user: UserResponse | null = null;
  summaries: BudgetSummaryItem[] = [];
  totalIncome = 0;
  totalExpense = 0;
  loading = true;

  ngOnInit(): void {
    const stored = sessionStorage.getItem('current_user');
    if (stored) this.user = JSON.parse(stored);

    this.categorySvc.budgetSummary().subscribe({
      next: (items) => {
        this.summaries = items;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    this.movementSvc.list({ page_size: 100 }).subscribe({
      next: (res) => {
        this.totalIncome = res.items
          .filter((m) => m.type === 'INCOME')
          .reduce((s, m) => s + m.amount, 0);
        this.totalExpense = res.items
          .filter((m) => m.type === 'EXPENSE')
          .reduce((s, m) => s + m.amount, 0);
      },
    });
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }
}
