// src/app/services/cart-detail.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartDetail } from '../models/cartDetail.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class CartDetailService {

  private apiUrl = 'http://localhost:8080/public/cartdetail'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all cart details
  getAllCartDetails(): Observable<CartDetail[]> {
    const url = `${this.apiUrl}/getAllCartDetails`;
    return this.http.get<CartDetail[]>(url);
  }

  // Search cart details by product name
  searchCartDetails(productName: string): Observable<CartDetail[]> {
    const url = `${this.apiUrl}/search/${productName}`;
    return this.http.get<CartDetail[]>(url);
  }

  // Add a new cart detail
  addCartDetail(cartDetail: CartDetail): Observable<CartDetail> {
    const url = `${this.apiUrl}/addCartDetail`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<CartDetail>(url, cartDetail, { headers });
  }

  // Update an existing cart detail by ID
  updateCartDetail(cartDetail: CartDetail): Observable<CartDetail> {
    const url = `${this.apiUrl}/updateCartDetail/${cartDetail.cartDetailID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<CartDetail>(url, cartDetail, { headers });
  }

  // Delete a cart detail by ID
  deleteCartDetail(cartDetailID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${cartDetailID}`;
    return this.http.delete<void>(url);
  }
}
