import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account .model';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Đường dẫn đến API của bạn

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Phương thức đăng nhập
  login(userName: string, passWord: string): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/login`, { userName, passWord }).pipe(
      tap((account: Account) => {
        console.log('Token nhận được:', account.token);
        console.log('Quyền:', account.role);
        
        // In token để kiểm tra
        this.setToken(account.token);
        this.setRole(account.role)
       // Lưu token vào local storage
      })
    );
  }

 
  // Lưu token vào local storage
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token); // Lưu token vào localStorage
    }
  }

  // Lấy token từ local storage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken'); // Hoặc sessionStorage tùy nhu cầu
    }
    return null;
  }
   // Lưu role vào localStorage

    // Lưu role vào localStorage
  setRole(role: number): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userRole', role.toString()); // Lưu role dưới dạng chuỗi
    }
  }

  // Lấy role từ localStorage
  getRole(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const role = localStorage.getItem('userRole');
      return role ? parseInt(role, 10) : null; // Chuyển đổi role từ chuỗi sang số
    }
    return null;
  }


  isAdmin(): boolean {
    const role = this.getRole();
    return role === 2; // Kiểm tra role có phải Admin (2)
  }

  // Kiểm tra xem người dùng có vai trò User không
  isUser(): boolean {
    const role = this.getRole();
    return role === 1; // Kiểm tra role có phải User (1)
  }
  // Kiểm tra xem người dùng đã đăng nhập chưa
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null; // Kiểm tra xem người dùng có token hay không
  }

  // Phương thức đăng xuất
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken'); 
      localStorage.removeItem('userRole'); // Xóa role// Xóa token khỏi localStorage
      console.log('Token và role đã bị xóa khỏi localStorage');
    }
  }
}
