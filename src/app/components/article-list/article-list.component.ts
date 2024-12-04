import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Article } from '../../models/article.model';
import { MatTableDataSource } from '@angular/material/table';
import { SharedMaterialModule } from '../../utils/shared-material.module';

@Component({
  selector: 'app-article-list',
  styleUrls: ['./article-list.component.css'],
  standalone: true,
  imports: [SharedMaterialModule],
  template: `
<div class="container">
  <!-- Campo de búsqueda -->
  <mat-form-field appearance="outline" class="search-field">
    <mat-label>Buscar artículo</mat-label>
    <input matInput (input)="applyFilter($event)" class="search-input">
  </mat-form-field>

  <!-- Tabla con artículos -->
  <table mat-table [dataSource]="dataSource">
    <ng-container matColumnDef="codigo">
      <th mat-header-cell *matHeaderCellDef>Código</th>
      <td mat-cell *matCellDef="let element">{{ element.codigo }}</td>
    </ng-container>

    <ng-container matColumnDef="descripcion">
      <th mat-header-cell *matHeaderCellDef>Descripción</th>
      <td mat-cell *matCellDef="let element">{{ element.descripcion }}</td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
  `
})
export class ArticleListComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'descripcion'];
  dataSource = new MatTableDataSource<Article>([]);

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadArticles();
  }

  /** LLAMA AL ENDPOINT **/
  // loadArticles(filter?: string) {
  //   this.stockService.getArticles(filter).subscribe({
  //     next: (articles) => {
  //       this.dataSource.data = articles;
  //     },
  //     error: (error) => {
  //       console.error('Error loading articles', error);
  //     },
  //   });
  // }

  /** MOCK/HARD **/
  loadArticles(filter?: string) {
    this.stockService.getArticlesMock().subscribe({
      next: (articles) => {
        //filtro manual
        if (filter) {
          this.dataSource.data = articles.filter((article) =>
            article.descripcion.toLowerCase().includes(filter.toLowerCase())
          );
        } else {
          this.dataSource.data = articles;
        }
      },
      error: (error) => {
        console.error('Error loading articles', error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.loadArticles(filterValue);
  }
}


