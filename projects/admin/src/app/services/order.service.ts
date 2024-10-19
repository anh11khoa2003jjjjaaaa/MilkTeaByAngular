// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order .model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080/public/orders'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    const url = `${this.apiUrl}/getAllOrders`;
    return this.http.get<Order[]>(url);
  }

  // Search orders by customer name
  searchOrders(customerName: string): Observable<Order[]> {
    const url = `${this.apiUrl}/search/${customerName}`;
    return this.http.get<Order[]>(url);
  }

  // Add a new order
  addOrder(order: Order): Observable<Order> {
    const url = `${this.apiUrl}/addOrder`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Order>(url, order, { headers });
  }

  // Update an existing order by ID
  updateOrder(order: Order): Observable<Order> {
    const url = `${this.apiUrl}/updateOrder/${order.orderID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Order>(url, order, { headers });
  }

  // Delete an order by ID
  deleteOrder(orderID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${orderID}`;
    return this.http.delete<void>(url);
  }
}
