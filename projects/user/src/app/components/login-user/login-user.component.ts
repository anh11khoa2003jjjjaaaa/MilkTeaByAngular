import { Component } from '@angular/core';
import { AuthService } from '../../../../../admin/src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Account } from '../../../../../admin/src/app/models/account .model';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css'] // Sửa styleUrl thành styleUrls
})
export class LoginUserComponent {
  userName: string = '';
  passWord: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Phương thức xử lý khi người dùng click vào nút đăng nhập
  onLogin(): void {
    // Kiểm tra xem userName và passWord không rỗng
    if (this.userName && this.passWord) {
      this.authService.login(this.userName, this.passWord).subscribe(
        (response: Account) => {
          // Kiểm tra token có hợp lệ không
          if (response.token) {
            // Lưu token vào localStorage
            this.authService.setToken(response.token);
            console.log("Đăng nhập thành công.");
            
            // Điều hướng đến trang chủ sau khi đăng nhập thành công
            this.router.navigate(['/']); // Điều hướng đến trang chủ của người dùng
            // location.assign('/');
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
