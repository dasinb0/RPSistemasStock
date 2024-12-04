import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { Article } from '../../models/article.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMaterialModule } from '../../utils/shared-material.module';
import { Deposit, StockEntryPayload } from '../../models/stock-entry.model';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { DepositService } from '../../services/deposit.service';

@Component({
  selector: 'app-stock-entry',
  styleUrls: ['./stock-entry.component.css'],
  standalone: true,
  imports: [SharedMaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  template: `
<form [formGroup]="stockEntryForm" (ngSubmit)="onSubmit()">
  <div class="container">
    <mat-form-field appearance="outline">
      <mat-label>Artículo</mat-label>
      <mat-select formControlName="articulo_codigo">
        <mat-option *ngIf="articles.length === 0" disabled>
          Cargando artículos...
        </mat-option>
        <mat-option *ngFor="let article of articles" [value]="article.codigo">
          {{ article.descripcion }}
        </mat-option>
      </mat-select>
      <mat-error *ngIf="stockEntryForm.get('articulo_codigo')?.hasError('required')">
        Seleccione un artículo.
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <input matInput type="number" formControlName="cantidad" placeholder="Cantidad">
      <mat-error *ngIf="stockEntryForm.get('cantidad')?.hasError('required')">
        La cantidad es obligatoria.
      </mat-error>
      <mat-error *ngIf="stockEntryForm.get('cantidad')?.hasError('min')">
        La cantidad debe ser mayor que 0.
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <input matInput formControlName="comprobante_codigo" value="STO" readonly>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Depósito</mat-label>
      <mat-select formControlName="deposito_codigo">
        <mat-option *ngFor="let deposit of deposits" [value]="deposit.codigo">
          {{deposit.descripcion}}
        </mat-option>
      </mat-select>
      <mat-error *ngIf="stockEntryForm.get('deposito_codigo')?.hasError('required')">
        Seleccione un depósito.
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <textarea matInput formControlName="observacion" placeholder="Observación"></textarea>
    </mat-form-field>

    <button mat-raised-button color="primary" type="submit" [disabled]="!stockEntryForm.valid || loading">
      Registrar Ingreso
    </button>
  </div>
</form>
  `
})
export class StockEntryComponent implements OnInit {
  stockEntryForm: FormGroup;
  articles: Article[] = [];
  deposits: Deposit[] = [];
  loading = false;
  private articlesLoaded = false;
  private depositsLoaded = false;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private depositService: DepositService,
    private snackBar: MatSnackBar
  ) {
    this.stockEntryForm = this.fb.group({
      articulo_codigo: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      comprobante_codigo: ['STO', Validators.required],
      deposito_codigo: ['', Validators.required],
      observacion: ['']
    });
  }

  ngOnInit() {
    this.loadArticles();
    this.loadDeposits();
  }

  loadArticles() {
    if (this.articlesLoaded) return;
    this.articlesLoaded = true;

    this.stockService.getArticles().subscribe({
      next: (articles) => { this.articles = articles; },
      error: (error) => { console.error('Error loading articles', error); }
    });
  }

  loadDeposits() {
    if (this.depositsLoaded) return;
    this.depositsLoaded = true;
    this.loading = true;
  
    this.depositService.getDeposits().subscribe({
      next: (deposits) => {
        this.deposits = deposits;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading deposits', error);
        this.loading = false;
      }
    });
  }  

  onSubmit() {
    if (this.stockEntryForm.valid) {
      const depositoCodigo = this.stockEntryForm.get('deposito_codigo')?.value;
  
      if (!depositoCodigo) {
        this.snackBar.open('Por favor, seleccione un depósito', 'Cerrar', { duration: 3000 });
        return;
      }
  
      const payload: StockEntryPayload = {
        api_key_rp: environment.apiKey,
        cabecera: {
          codigo_comprobante: this.stockEntryForm.get('comprobante_codigo')?.value || 'STO',
          codigo_deposito: depositoCodigo
        },
        articulos: [
          {
            codigo_articulo: this.stockEntryForm.get('articulo_codigo')?.value,
            cantidad: this.stockEntryForm.get('cantidad')?.value,
            obser: this.stockEntryForm.get('observacion')?.value
          }
        ]
      };
  
      this.stockService.createStockEntry(payload).subscribe({
        next: () => {
          this.snackBar.open('Ingreso de stock registrado exitosamente', 'Cerrar', { duration: 3000 });
          this.stockEntryForm.reset({ comprobante_codigo: 'STO' });
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error al registrar ingreso de stock';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          console.error('Error creating stock entry', error);
        }
      });
    } else {
      this.snackBar.open('Formulario incompleto. Por favor, complete todos los campos.', 'Cerrar', { duration: 3000 });
    }
  }  
}
