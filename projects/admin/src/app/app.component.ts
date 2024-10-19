import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Import for interceptors
import { AuthInterceptor } from './auth/auth.interceptor';  // Import your interceptor
import { AuthService } from './auth/auth.service';

import { routes } from '../../../user/src/app/app.routes';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Include RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppComponent implements OnInit {

  islogout: boolean=false;
  title = 'Admin';
  constructor(private account:AuthService, private router: Router){}

ngOnInit(): void {
    
}
// Hàm đăng xuất
onLogout(): void {
  this.account.logout(); // Gọi hàm logout từ AuthService

  // Kiểm tra xem token có bị xóa hay không
  if (!localStorage.getItem('token')) {
    this.islogout = true; // Cập nhật trạng thái islogout
    console.log("Đăng xuất thành công!");
    this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
  } else {
    this.islogout = false;
    console.log("Đăng xuất thất bại");
  }
  

  }
}
