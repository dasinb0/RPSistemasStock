import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article } from '../models/article.model';
import { StockEntryPayload } from '../models/stock-entry.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.apiBaseUrl;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.apiKey}`
    });
  }

  getArticles(description?: string): Observable<Article[]> {
    const body = {
      api_key_rp: environment.apiKey,
      articulo: description ? { descripcion: description } : undefined,
    };
  
    return this.http.post<{ info: { datos: Article[] } }>(
      `${this.apiUrl}/stock/articulos.php`,
      body,
      { headers: this.headers }
    ).pipe(
      map((response) => response.info.datos)
    );
  }

    // Simulación de datos mock
    getArticlesMock(): Observable<Article[]> {
      return this.http.get<{ info: { datos: Article[] } }>('assets/mocks/mock-articles.json').pipe(
        map((response) => response.info.datos)
      );
    }    

    createStockEntry(entry: StockEntryPayload): Observable<any> {
      return this.http.post(`${this.apiUrl}/stock/generar_ingreso.php`, entry, { 
        headers: this.headers 
      });
    }    
}