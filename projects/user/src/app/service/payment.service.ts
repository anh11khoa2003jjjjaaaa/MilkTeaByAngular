
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient,private authService:AuthService ) {}

  createPayment(paymentData: any) {
    const token = this.authService.getToken(); 
    
    if (!token) {
      return throwError(() => new Error('User is not authenticated. Token is missing.'));
    }

    return this.http
      .post('http://localhost:8080/public/payment/create', paymentData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }),
        observe: 'response', // Nhận phản hồi hoàn chỉnh từ server
      })
      .pipe(
        catchError((error) => {
          console.error('Error occurred during payment creation: ', error);
          return throwError(error);
        })
      );
  }
}
