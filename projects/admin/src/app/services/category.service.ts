// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model'; // Import the model
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/public/categorie'; // Base API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Hàm lấy tất cả thông tin trong bảng `categories`
  getAllCategories(): Observable<Category[]> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` }); // Tạo header với token
    const url = `${this.apiUrl}/getAllCategories`;
    return this.http.get<Category[]>(url, { headers }); // Gửi yêu cầu GET với header
  }

  // Tìm kiếm danh mục theo tên
  searchCategories(categoryName: string): Observable<Category[]> {
    const token = this.authService.getToken(); // Lấy token
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` }); // Tạo header với token
    const url = `${this.apiUrl}/search/${categoryName}`;
    return this.http.get<Category[]>(url, { headers }); // Gửi yêu cầu GET với header
  }

  // Thêm một danh mục mới
  addCategory(category: Category): Observable<Category> {
    const token = this.authService.getToken(); // Lấy token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Thêm token vào header
    });
    const url = `${this.apiUrl}/addCategories`;
    return this.http.post<Category>(url, category, { headers }); // Gửi yêu cầu POST với header
  }

  // Cập nhật một danh mục hiện có theo ID
  updateCategory(category: Category): Observable<Category> {
    const token = this.authService.getToken(); // Lấy token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Thêm token vào header
    });
    const url = `${this.apiUrl}/updateCategories/${category.categoryID}`;
    return this.http.put<Category>(url, category, { headers }); // Gửi yêu cầu PUT với header
  }

  // Xóa một danh mục theo ID
  deleteCategory(categoryID: string): Observable<void> {
    const token = this.authService.getToken(); // Lấy token
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` }); // Tạo header với token
    const url = `${this.apiUrl}/delete/${categoryID}`;
    return this.http.delete<void>(url, { headers }); // Gửi yêu cầu DELETE với header
  }
}
