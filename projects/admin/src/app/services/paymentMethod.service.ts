// src/app/services/payment-method.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/paymentMethod.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private apiUrl = 'http://localhost:8080/public/payment-methods'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all payment methods
  getAllPaymentMethods(): Observable<PaymentMethod[]> {
    const url = `${this.apiUrl}/getAllPaymentMethods`;
    return this.http.get<PaymentMethod[]>(url);
  }

  // Search payment methods by name
  searchPaymentMethods(methodName: string): Observable<PaymentMethod[]> {
    const url = `${this.apiUrl}/search/${methodName}`;
    return this.http.get<PaymentMethod[]>(url);
  }

  // Add a new payment method
  addPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    const url = `${this.apiUrl}/addPaymentMethod`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<PaymentMethod>(url, paymentMethod, { headers });
  }

  // Update an existing payment method by ID
  updatePaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    const url = `${this.apiUrl}/updatePaymentMethod/${paymentMethod.paymentMethodID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<PaymentMethod>(url, paymentMethod, { headers });
  }

  // Delete a payment method by ID
  deletePaymentMethod(paymentMethodID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${paymentMethodID}`;
    return this.http.delete<void>(url);
  }
}
