import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Account } from '../models/account .model'; // Import the Account model
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Sửa lỗi từ 'styleUrl' thành 'styleUrls'
})
export class LoginComponent {
  userName: string = '';
  passWord: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Phương thức xử lý khi người dùng click vào nút đăng nhập
  // Phương thức xử lý khi người dùng click vào nút đăng nhập
  onLogin(): void {
    // Kiểm tra xem userName và passWord không rỗng
    if (this.userName && this.passWord) {
      this.authService.login(this.userName, this.passWord).subscribe(
        (response: Account) => {
          // Kiểm tra token có hợp lệ không
          if (response.token) {
            // Lưu token và vai trò vào localStorage
            this.authService.setToken(response.token);
            this.authService.setRole(response.role); // Lưu role
            console.log("Người dùng có quyền:", response.role==1?"User":"Admin");
            // Phân quyền và điều hướng dựa trên vai trò của người dùng
            if (response.role === 2) {
              this.router.navigate(['/home']); // Nếu là Admin, chuyển hướng đến trang Admin
            } else if (response.role === 1) {
              this.router.navigate(['/user']); // Nếu là User, chuyển hướng đến trang User
            } else {
              this.errorMessage = 'Unknown user role';
            }
          } else {
            this.errorMessage = 'Login failed. No token received.';
          }
        },
        error => {
          // Xử lý khi đăng nhập thất bại
          this.errorMessage = 'Invalid username or password';
        }
      );
    } else {
      this.errorMessage = 'Username and password cannot be empty';
    }
  }
}
