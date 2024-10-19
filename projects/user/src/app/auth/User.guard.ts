import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Kiểm tra xem người dùng có đăng nhập hay không (token hợp lệ)
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/loginUser']); // Điều hướng về trang đăng nhập nếu chưa đăng nhập
      return false;
    }
    return true; // Cho phép truy cập nếu người dùng đã đăng nhập
  }
}
