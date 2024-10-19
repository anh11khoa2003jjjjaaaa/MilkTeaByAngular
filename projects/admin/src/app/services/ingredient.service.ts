// src/app/services/ingredient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient .model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private apiUrl = 'http://localhost:8080/public/ingredients'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all ingredients
  getAllIngredients(): Observable<Ingredient[]> {
    const url = `${this.apiUrl}/getAllIngredients`;
    return this.http.get<Ingredient[]>(url);
  }

  // Search ingredients by name
  searchIngredients(ingredientName: string): Observable<Ingredient[]> {
    const url = `${this.apiUrl}/search/${ingredientName}`;
    return this.http.get<Ingredient[]>(url);
  }

  // Add a new ingredient
  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    const url = `${this.apiUrl}/addIngredient`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Ingredient>(url, ingredient, { headers });
  }

  // Update an existing ingredient by ID
  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    const url = `${this.apiUrl}/updateIngredient/${ingredient.ingredientID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Ingredient>(url, ingredient, { headers });
  }

  // Delete an ingredient by ID
  deleteIngredient(ingredientID: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${ingredientID}`;
    return this.http.delete<void>(url);
  }
}
