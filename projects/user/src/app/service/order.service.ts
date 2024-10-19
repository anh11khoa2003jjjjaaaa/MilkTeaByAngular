import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest } from '../models/OrderRequest'; // Model cho order request
import { AuthService } from '../auth/auth.service';
import { OrderDetailsResponse } from '../models/OrderDetail.model'; // Model cho order details response
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = 'http://localhost:8080/public/orders';  // API endpoint chính

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Lấy token từ AuthService
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,  // Thêm Authorization header với token
      'Content-Type': 'application/json' // Đảm bảo Content-Type là JSON
    });
  }

  createOrder(orderRequest: OrderRequest): Observable<any> {
    const headers = this.getHeaders();  // Lấy headers
    const apiUrl = `${this.url}/create`;  // Endpoint cho việc tạo đơn hàng
    return this.http.post(apiUrl, orderRequest, { headers });
  }

 //hàm lấy tất cả đươn hàng theo userID
  getAllOrders(userID: string): Observable<OrderRequest[]> {
    const headers = this.getHeaders();  // Lấy headers
    const apiUrl = `${this.url}/customer/${userID}`;  // Endpoint để lấy đơn hàng của khách hàng
    return this.http.get<OrderRequest[]>(apiUrl, { headers });  // Sử dụng GET
  }
  //   getAllOrders(userID: string): Observable<any[]> {
  //   const headers = this.getHeaders();  // Lấy headers
  //   const apiUrl = `${this.url}/customer/${userID}`;  // Endpoint để lấy đơn hàng của khách hàng
  //   return this.http.get<any[]>(apiUrl, { headers });  // Sử dụng GET
  // }

  cancelOrder(orderID: number, cancellationReason: string): Observable<any> {
    const headers = this.getHeaders();  // Lấy headers (nếu có cần thiết)
    const apiUrl = `${this.url}/${orderID}/cancel?cancellationReason=${encodeURIComponent(cancellationReason)}`;  // Endpoint để hủy đơn hàng, tham số cancellationReason là một tham số query
    return this.http.put(apiUrl, {}, { headers });  // Gửi yêu cầu PUT hủy đơn hàng
  }
  

getAll():Observable<any>{
const headers=this.getHeaders();
const apiUrl=`${this.url}/getAllOrders`;
return this.http.get(apiUrl,{headers})
  }

  approveOrder(orderID: number, statusOrder: string): Observable<any> {
    const headers = this.getHeaders(); // Assuming getHeaders returns HttpHeaders
    const apiUrl = `${this.url}/${orderID}/approve/${statusOrder}`; // Corrected URL path
    
    // Call the API and pass headers. No need for a request body.
    return this.http.put(apiUrl, null, { headers }); // Pass 'null' for the body
  }
  
  getOrderById(orderId: number): Observable<any> {
    const headers = this.getHeaders(); 
    const url = `${this.url}/${orderId}`;
    return this.http.get<any>(url, { headers })
  }

  /**
   * Hủy đơn hàng với xác nhận từ người dùng và cập nhật lại danh sách đơn hàng.
   * @param orderID ID của đơn hàng cần hủy.
   * @param customerID ID của khách hàng.
   */
  // confirmAndCancelOrder(orderID: number, cancellationReason:string ): void {
  //   if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
  //     this.cancelOrder(orderID,cancellationReason).subscribe(
  //       (response) => {
  //         alert('Đơn hàng đã được hủy.');
  //         this.getAllOrders(response.userID).subscribe();  // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
  //       },
  //       (error) => {
  //         alert('Lỗi khi hủy đơn hàng.');
  //         console.error('Error canceling order:', error);
  //       }
  //     );
  //   }
  
}
