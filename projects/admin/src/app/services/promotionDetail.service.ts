import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // Import AuthService nếu cần thiết
import { Promotion } from '../models/promotion.model';
 // Đảm bảo có PromotionModel hoặc thay đổi theo model của bạn

@Injectable({
  providedIn: 'root'
})
export class PromotionDetailtionService {

  private apiUrl = 'http://localhost:8080/public/promotions';  // Cập nhật URL đúng với backend của bạn

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Lấy headers với token xác thực
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Gửi token trong header
    });
  }

  // Lấy danh sách khuyến mãi với tên
  getAllPromotionDetailsWithNames(): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/promotionDetailsWithNames`;
    return this.http.get<any>(url, { headers });
  }

  // Thêm mới khuyến mãi
  addPromotion(promotion: Promotion): Observable<Promotion> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/add`;
    return this.http.post<Promotion>(url, promotion, { headers });
  }

  // Cập nhật khuyến mãi
  updatePromotion(promotionID: string, promotion: Promotion): Observable<Promotion> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/update/${promotionID}`;
    return this.http.put<Promotion>(url, promotion, { headers });
  }

  // Xóa khuyến mãi
  deletePromotion(promotionID: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/delete/${promotionID}`;
    return this.http.delete<any>(url, { headers });
  }

  // Lấy chi tiết khuyến mãi theo ID
  getPromotionById(promotionID: string): Observable<Promotion> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/get/${promotionID}`;
    return this.http.get<Promotion>(url, { headers });
  }
}
