// src/app/services/order-details.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetail } from '../models/orderDetail.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  private apiUrl = 'http://localhost:8080/public/orderDetails'; // Base API URL

  constructor(private http: HttpClient) { }

  // Get all order details
  getAllOrderDetails(): Observable<OrderDetail[]> {
    const url = `${this.apiUrl}/getAllOrderDetails`;
    return this.http.get<OrderDetail[]>(url);
  }

  // Search order details by order ID
  searchOrderDetails(orderID: string): Observable<OrderDetail[]> {
    const url = `${this.apiUrl}/search/${orderID}`;
    return this.http.get<OrderDetail[]>(url);
  }

  // Add a new order detail
  addOrderDetail(orderDetail: OrderDetail): Observable<OrderDetail> {
    const url = `${this.apiUrl}/addOrderDetail`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<OrderDetail>(url, orderDetail, { headers });
  }

  // Update an existing order detail by ID
  updateOrderDetail(orderDetail: OrderDetail): Observable<OrderDetail> {
    const url = `${this.apiUrl}/updateOrderDetail/${orderDetail.orderDetailID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<OrderDetail>(url, orderDetail, { headers });
  }

  // Delete an order detail by ID
  deleteOrderDetail(orderDetailID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${orderDetailID}`;
    return this.http.delete<void>(url);
  }
}
