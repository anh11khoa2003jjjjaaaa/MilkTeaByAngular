// src/app/services/ingredient-stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngredientStock } from '../models/ingredientStock .model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class IngredientStockService {

  private apiUrl = 'http://localhost:8080/public/ingredient_stock'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all ingredient stocks
  getAllIngredientStocks(): Observable<IngredientStock[]> {
    const url = `${this.apiUrl}/getAllIngredientStocks`;
    return this.http.get<IngredientStock[]>(url);
  }

  // Search ingredient stocks by name
  searchIngredientStocks(ingredientName: string): Observable<IngredientStock[]> {
    const url = `${this.apiUrl}/search/${ingredientName}`;
    return this.http.get<IngredientStock[]>(url);
  }

  // Add a new ingredient stock
  addIngredientStock(ingredientStock: IngredientStock): Observable<IngredientStock> {
    const url = `${this.apiUrl}/addIngredientStock`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<IngredientStock>(url, ingredientStock, { headers });
  }

  // Update an existing ingredient stock by ID
  updateIngredientStock(ingredientStock: IngredientStock): Observable<IngredientStock> {
    const url = `${this.apiUrl}/updateIngredientStock/${ingredientStock.stockID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<IngredientStock>(url, ingredientStock, { headers });
  }

  // Delete an ingredient stock by ID
  deleteIngredientStock(stockID: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${stockID}`;
    return this.http.delete<void>(url);
  }
}
