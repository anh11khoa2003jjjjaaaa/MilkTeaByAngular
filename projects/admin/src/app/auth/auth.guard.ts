import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Kiểm tra xem người dùng có vai trò Admin (role === 2)
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']); // Điều hướng về trang đăng nhập nếu không phải Admin
      return false;
    }
    
    return true; // Cho phép truy cập nếu là Admin
  }
  // canActivate(): boolean {
  //   // Kiểm tra xem người dùng có đăng nhập chưa
  //   const isLoggedIn = this.authService.isLoggedIn();
   
  //   if (!isLoggedIn) {
  //     this.router.navigate(['/login']); // Điều hướng về trang đăng nhập nếu chưa đăng nhập
  //     return false;
  //   }
  //   return true; // Cho phép truy cập nếu đã đăng nhập
  // }

  // canActivate(): boolean {
  //   // Kiểm tra xem người dùng có đăng nhập chưa
  //   const isLoggedIn = this.authService.isLoggedIn();
   
  //   if (!isLoggedIn) {
  //     this.router.navigate(['/login']); // Điều hướng về trang đăng nhập nếu chưa đăng nhập
  //     return false;
  //   }
  //   return true; // Cho phép truy cập nếu đã đăng nhập
  // }
  // canActivate(): boolean {
  //   if (!this.authService.isLoggedIn()) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  //   return true;
  // }
}
