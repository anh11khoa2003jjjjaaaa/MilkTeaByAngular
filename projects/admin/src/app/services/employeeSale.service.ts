// src/app/services/employee-sale.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeSale } from '../models/employeeSale .model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class EmployeeSaleService {

  private apiUrl = 'http://localhost:8080/public/employee_sales'; // Base API URL

  // Inject HttpClient for using HTTP methods like `get`, `post`, `put`, `delete`
  constructor(private http: HttpClient) { }

  // Get all employee sales
  getAllEmployeeSales(): Observable<EmployeeSale[]> {
    const url = `${this.apiUrl}/getAllEmployeeSales`;
    return this.http.get<EmployeeSale[]>(url);
  }

  // Search employee sales by employee name
  searchEmployeeSales(employeeName: string): Observable<EmployeeSale[]> {
    const url = `${this.apiUrl}/search/${employeeName}`;
    return this.http.get<EmployeeSale[]>(url);
  }

  // Add a new employee sale record
  addEmployeeSale(employeeSale: EmployeeSale): Observable<EmployeeSale> {
    const url = `${this.apiUrl}/addEmployeeSale`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<EmployeeSale>(url, employeeSale, { headers });
  }

  // Update an existing employee sale by ID
  updateEmployeeSale(employeeSale: EmployeeSale): Observable<EmployeeSale> {
    const url = `${this.apiUrl}/updateEmployeeSale/${employeeSale.saleID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<EmployeeSale>(url, employeeSale, { headers });
  }

  // Delete an employee sale record by ID
  deleteEmployeeSale(employeeSaleID: string): Observable<void> {
    const url = `${this.apiUrl}/delete/${employeeSaleID}`;
    return this.http.delete<void>(url);
  }
}
