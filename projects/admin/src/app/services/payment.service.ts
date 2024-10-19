// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8080/public/payments'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all payments
  getAllPayments(): Observable<Payment[]> {
    const url = `${this.apiUrl}/getAllPayments`;
    return this.http.get<Payment[]>(url);
  }

  // Search payments by order ID
  searchPayments(orderID: string): Observable<Payment[]> {
    const url = `${this.apiUrl}/search/${orderID}`;
    return this.http.get<Payment[]>(url);
  }

  // Add a new payment
  addPayment(payment: Payment): Observable<Payment> {
    const url = `${this.apiUrl}/addPayment`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Payment>(url, payment, { headers });
  }

  // Update an existing payment by ID
  updatePayment(payment: Payment): Observable<Payment> {
    const url = `${this.apiUrl}/updatePayment/${payment.paymentID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Payment>(url, payment, { headers });
  }

  // Delete a payment by ID
  deletePayment(paymentID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${paymentID}`;
    return this.http.delete<void>(url);
  }
}
