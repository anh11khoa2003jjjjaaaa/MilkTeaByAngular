// src/app/services/customer-review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerReview } from '../models/customerReview.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class CustomerReviewService {

  private apiUrl = 'http://localhost:8080/public/customer_reviews'; // Base API URL

  // Inject dependencies `HttpClient` to use HTTP methods (`get`, `put`, `post`, `delete`, etc.)
  constructor(private http: HttpClient) { }

  // Get all customer reviews
  getAllCustomerReviews(): Observable<CustomerReview[]> {
    const url = `${this.apiUrl}/all`;
    return this.http.get<CustomerReview[]>(url);
  }

  // Search customer reviews by customer name or other criteria (if applicable)
  searchCustomerReviews(searchTerm: string): Observable<CustomerReview[]> {
    const url = `${this.apiUrl}/search/${searchTerm}`;
    return this.http.get<CustomerReview[]>(url);
  }

  // Add a new customer review
  addCustomerReview(review: CustomerReview): Observable<CustomerReview> {
    const url = `${this.apiUrl}/add`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<CustomerReview>(url, review, { headers });
  }

  // Update an existing customer review by ID
  updateCustomerReview(review: CustomerReview): Observable<CustomerReview> {
    const url = `${this.apiUrl}/update/${review.reviewID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<CustomerReview>(url, review, { headers });
  }

  // Delete a customer review by ID
  deleteCustomerReview(reviewID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${reviewID}`;
    return this.http.delete<void>(url);
  }
}
