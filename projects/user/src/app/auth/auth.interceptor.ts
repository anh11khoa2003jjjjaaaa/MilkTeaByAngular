import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Danh sách các URL không cần xác thực token
    const publicUrls = [
      '/auth/login',
      '/auth/register',
      '/IMG/',
      '/public/product/getAllProduct'
    ];

    // Kiểm tra nếu request là API public thì không thêm token
    const isPublicRequest = publicUrls.some(url => request.url.startsWith(url));

    if (!isPublicRequest) {
      const token = this.authService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request);
  }
}

