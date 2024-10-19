// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model'; // Import the Employee model
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:8080/public/employees'; // Base API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get all employees
  getAllEmployees(): Observable<Employee[]> {
    const token = this.authService.getToken(); // Get the token from AuthService
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Add token to headers
    });
    const url = `${this.apiUrl}/all`;
    return this.http.get<Employee[]>(url, { headers }); // Return Observable of Employee[]
  }

  // Search employees by name
  searchEmployees(employeeName: string): Observable<Employee[]> {
    const token = this.authService.getToken(); // Get the token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Add token to headers
    });
    const url = `${this.apiUrl}/search/${employeeName}`;
    return this.http.get<Employee[]>(url, { headers }); // Return Observable of Employee[]
  }

  // Add a new employee
  addEmployee(employee: Employee): Observable<Employee> {
    const token = this.authService.getToken(); // Get the token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Add token to headers
    });
    const url = `${this.apiUrl}/addEmployee`;
    return this.http.post<Employee>(url, employee, { headers }); // Return Observable of Employee
  }

  // Update an existing employee by ID
  updateEmployee(employee: Employee): Observable<Employee> {
    const token = this.authService.getToken(); // Get the token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Add token to headers
    });
    const url = `${this.apiUrl}/updateEmployee/${employee.employeeID}`;
    return this.http.put<Employee>(url, employee, { headers }); // Return Observable of Employee
  }

  // Delete an employee by ID
  deleteEmployee(employeeID: number): Observable<void> {
    const token = this.authService.getToken(); // Get the token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Add token to headers
    });
    const url = `${this.apiUrl}/delete/${employeeID}`;
    return this.http.delete<void>(url, { headers }); // Return Observable of void
  }
}
