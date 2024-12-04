import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Deposit, StockEntryPayload } from '../models/stock-entry.model';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private apiUrl = environment.apiBaseUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  //REVISAR ENDPOINTS
  getDeposits(): Observable<Deposit[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { api_key_rp: this.apiKey };
  
    return this.http.post<any>(`${this.apiUrl}/stock/depositos.php`, body, { headers }).pipe(
      map((response) => response.info.datos)
    );
  }  

  createStockEntry(payload: StockEntryPayload): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.post(`${this.apiUrl}/stock/generar_ingresos.php`, payload, { headers });
  }
} 