import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MovementService } from '../../../core/services/movement.service';
import { CategoryService } from '../../../core/services/category.service';
import { MovementResponse, MovementFilters } from '../../../core/models/movement';
import { CategoryResponse } from '../../../core/models/category';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
  ],
  templateUrl: './movement-list.html',
  styleUrl: './movement-list.scss',
})
export class MovementList implements OnInit {
  private movementSvc = inject(MovementService);
  private categorySvc = inject(CategoryService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  columns = ['created_at', 'description', 'category_name', 'type', 'amount', 'actions'];
  movements: MovementResponse[] = [];
  categories: CategoryResponse[] = [];
  loading = true;
  total = 0;

  filters: MovementFilters = {
    movement_type: '',
    category_id: undefined,
    date_from: '',
    date_to: '',
    page: 1,
    page_size: 10,
  };

  ngOnInit(): void {
    this.categorySvc.list().subscribe((c) => (this.categories = c));
    this.load();
  }

  load(): void {
    this.loading = true;
    const params: MovementFilters = {
      page: this.filters.page,
      page_size: this.filters.page_size,
    };
    if (this.filters.movement_type) params.movement_type = this.filters.movement_type;
    if (this.filters.category_id) params.category_id = this.filters.category_id;
    if (this.filters.date_from) params.date_from = this.filters.date_from;
    if (this.filters.date_to) params.date_to = this.filters.date_to;

    this.movementSvc.list(params).subscribe({
      next: (res) => {
        this.movements = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPage(e: PageEvent): void {
    this.filters.page = e.pageIndex + 1;
    this.filters.page_size = e.pageSize;
    this.load();
  }

  clearFilters(): void {
    this.filters = {
      movement_type: '',
      category_id: undefined,
      date_from: '',
      date_to: '',
      page: 1,
      page_size: 10,
    };
    this.load();
  }

  create(): void {
    this.router.navigate(['/movements/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/movements', id]);
  }

  delete(id: number): void {
    this.dialog.open(ConfirmDialog, {
      data: { title: 'Eliminar movimiento', message: '¿Eliminar este movimiento?' },
    }).afterClosed().subscribe((result) => {
      if (!result) return;
      this.movementSvc.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Movimiento eliminado', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: (err) => {
          const msg = err.error?.detail || 'Error al eliminar';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        },
      });
    });
  }
}
