// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8080/public/cart'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all items in the cart
  getAllCartItems(): Observable<Cart[]> {
    const url = `${this.apiUrl}/getAllCartItems`;
    return this.http.get<Cart[]>(url);
  }

  // Search cart items by product name
  searchCartItems(productName: string): Observable<Cart[]> {
    const url = `${this.apiUrl}/search/${productName}`;
    return this.http.get<Cart[]>(url);
  }

  // Add a new item to the cart
  addCartItem(cartItem: Cart): Observable<Cart> {
    const url = `${this.apiUrl}/addCartItem`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Cart>(url, cartItem, { headers });
  }

  // Update an existing cart item by ID
  updateCartItem(cartItem: Cart): Observable<Cart> {
    const url = `${this.apiUrl}/updateCartItem/${cartItem.cartID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Cart>(url, cartItem, { headers });
  }

  // Delete a cart item by ID
  deleteCartItem(cartItemID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${cartItemID}`;
    return this.http.delete<void>(url);
  }
}
