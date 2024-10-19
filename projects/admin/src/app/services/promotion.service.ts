import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model'; // Import the Promotion model
import { AuthService } from '../auth/auth.service';
 // Giả sử bạn có một AuthService để lấy token

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private apiUrl = 'http://localhost:8080/public/promotions'; // Base API URL

  // Inject HttpClient and AuthService for token authentication
  constructor(private http: HttpClient, private authService: AuthService) { }

  // Lấy token từ AuthService và tạo HttpHeaders với xác thực
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Gửi token trong header
    });
  }

  // Lấy tất cả các khuyến mãi
  getAllPromotions(): Observable<Promotion[]> {
    const url = `${this.apiUrl}/all`;
    const headers = this.getAuthHeaders();
    return this.http.get<Promotion[]>(url, { headers });
  }

  // Tìm kiếm khuyến mãi theo tên
  searchPromotions(promotionName: string): Observable<Promotion[]> {
    const url = `${this.apiUrl}/search/name?name=${promotionName}`;
    const headers = this.getAuthHeaders();
    return this.http.get<Promotion[]>(url, { headers });
  }

  // Tìm kiếm khuyến mãi theo khoảng thời gian
  searchPromotionsByDate(startDate: string, endDate: string): Observable<Promotion[]> {
    const url = `${this.apiUrl}/search/date?startDate=${startDate}&endDate=${endDate}`;
    const headers = this.getAuthHeaders();
    return this.http.get<Promotion[]>(url, { headers });
  }

  // Thêm khuyến mãi mới
  addPromotion(promotion: Promotion): Observable<Promotion> {
    const url = `${this.apiUrl}/add`;
    const headers = this.getAuthHeaders();
    return this.http.post<Promotion>(url, promotion, { headers });
  }

  // Cập nhật khuyến mãi theo ID
  updatePromotion(promotion: Promotion): Observable<Promotion> {
    const url = `${this.apiUrl}/update/${promotion.promotionID}`;
    const headers = this.getAuthHeaders();
    return this.http.put<Promotion>(url, promotion, { headers });
  }

  // Xóa khuyến mãi theo ID
  deletePromotion(promotionID: string): Observable<boolean> {
    const url = `${this.apiUrl}/delete/${promotionID}`; // Tạo URL API
    const headers = this.getAuthHeaders(); // Lấy headers nếu có yêu cầu xác thực

    return this.http.delete<boolean>(url, { headers }); // Gửi yêu cầu DELETE và trả về boolean
  }

  // Lấy khuyến mãi theo ID
  getPromotionById(promotionID: string): Observable<Promotion> {
    const url = `${this.apiUrl}/get/${promotionID}`;
    const headers = this.getAuthHeaders();
    return this.http.get<Promotion>(url, { headers });
  }
}
