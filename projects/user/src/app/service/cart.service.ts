// import { Injectable, Inject } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { AuthService } from '../auth/auth.service';
// import { CartRequest } from '../../../../admin/src/app/models/cartRequest.model';
// import { Cart } from '../../../../admin/src/app/models/cart.model';
// import { CartDetail } from '../../../../admin/src/app/models/cartDetail.model';
// import { Product } from '../../../../admin/src/app/models/product.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private cart: Cart | null = null;
//   private cartDetails: CartDetail[] = [];
//   private apiUrl = 'http://localhost:8080/public/cart/addProduct';
//   private isBrowser: boolean;

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//     if (this.isBrowser) {
//       this.loadCartFromLocalStorage();
//     }
//   }

//   private loadCartFromLocalStorage(): void {
//     if (this.isBrowser) {
//       const storedCart = localStorage.getItem('cart');
//       const storedCartDetails = localStorage.getItem('cartDetails');
//       this.cart = storedCart ? JSON.parse(storedCart) : null;
//       this.cartDetails = storedCartDetails ? JSON.parse(storedCartDetails) : [];
//     }
//   }

//   private isUserLoggedIn(): boolean {
//     return this.authService.isLoggedIn();
//   }

//   private getUserID(): string | null {
//     const token = this.getAuthToken();
//     if (!token) return null;

//     const userInfo = this.authService.parseJwt(token);
//     if (this.isBrowser) {
//       localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
//       const storedUser = localStorage.getItem('loggedInUser');
//       return storedUser ? JSON.parse(storedUser).userID : null;
//     }
//     return null;
//   }

//   private getAuthToken(): string | null {
//     return this.authService.getToken();
//   }

//   public generateUniqueID(): number {
//     return Date.now() + Math.floor(Math.random() * 1000);
//   }

//   addToCart(cartRequest: CartRequest): Observable<any> {
//     if (!this.isUserLoggedIn()) {
//       alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
//       return of(null);
//     }
  
//     const userID = this.getUserID();
//     if (!userID) {
//       alert('Không tìm thấy thông tin người dùng!');
//       return of(null);
//     }
  
//     const token = this.getAuthToken();
//     if (!token) {
//       alert('Bạn cần đăng nhập lại để tiếp tục!');
//       return of(null);
//     }
  
//     // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
//     if (!this.cart) {
//       this.cart = {
//         cartID: this.generateUniqueID(), // Tạo ID giỏ hàng mới
//         userID,
//         createdDate: new Date() // Ngày tạo giỏ hàng
//       };
//     }
  
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
//     // Tạo CartModel và CartDetailModel dựa trên dữ liệu từ giao diện
//     const cartModel = {
//       cartID: cartRequest.cartmodel.cartID, // Gán ID giỏ hàng
//       userID: cartRequest.cartmodel.userID,
//       createdDate: cartRequest.cartmodel.createdDate
//     };
  
//     const cartDetailModel = {
//       cartDetailID: this.generateUniqueID(), // Tạo ID chi tiết giỏ hàng mới
//       cartID: cartRequest.cartmodel.cartID, // Gán cartID cho chi tiết giỏ hàng
//       productID: cartRequest.cartdetail.productID,
//       quantity: cartRequest.cartdetail.quantity,
//       price: cartRequest.cartdetail.price,
//       size: cartRequest.cartdetail.size,
//       image: cartRequest.cartdetail.image
//     };
  
//     // Gửi yêu cầu đến backend với cấu trúc JSON phù hợp
//     const payload = {
//       cartModel: cartModel,
//       cartDetailModel: cartDetailModel
//     };
  
//     // Gửi yêu cầu POST để lưu giỏ hàng và chi tiết giỏ hàng cùng lúc
//     return this.http.post(this.apiUrl, payload, { headers })
//       .pipe(
//         map((response: any) => {
    

//           console.log('Giỏ hàng và sản phẩm đã được thêm thành công:', response);
  
//           // Lưu chi tiết vào LocalStorage
//           this.cartDetails.push(cartDetailModel);
//           this.saveCartToLocalStorage();
  
//           return response;
//         }),
//         catchError((error) => {
//           console.error('Lỗi khi thêm giỏ hàng và sản phẩm:', error);
//           console.log('Cart Model:', cartModel);
//           console.log('Cart Detail Model:', cartDetailModel);
//           alert('Có lỗi khi thêm giỏ hàng và sản phẩm. Vui lòng thử lại! ' + error.message);
//           return of(null);
//         })
//       );
//   }
  

//   private saveCartToLocalStorage(): void {
//     if (this.isBrowser) {
//       localStorage.setItem('cart', JSON.stringify(this.cart));
//       localStorage.setItem('cartDetails', JSON.stringify(this.cartDetails));
//     }
//   }

 
//   getCartDetails(): CartDetail[] {
//     return this.cartDetails;
//   }

//   getTotalPrice(): number {
//     return this.cartDetails.reduce((total, detail) => total + (detail.price * detail.quantity), 0);
//   }

//   clearCart(): void {
//     this.cartDetails = [];
//     if (this.isBrowser) {
//       localStorage.removeItem('cart');
//       localStorage.removeItem('cartDetails');
//     }
//   }
 
// }
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { CartRequest } from '../../../../admin/src/app/models/cartRequest.model';
import { Cart } from '../../../../admin/src/app/models/cart.model';
import { CartDetail } from '../../../../admin/src/app/models/cartDetail.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart | null = null;
  private cartDetails: CartDetail[] = [];
  private apiUrl = 'http://localhost:8080/public/cart/addProduct';
  private apiURLcartUserID='http://localhost:8080/public/cart/getCartByUserID';
  private apiURLcartDetailUpdate='http://localhost:8080/public/cart/update';
  private apiURLcartRemove='http://localhost:8080/public/cart/remove';
  private apiURLcartClear='http://localhost:8080/public/cart/clear';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadCartFromLocalStorage();
    }
  }

  private loadCartFromLocalStorage(): void {
    if (!this.isBrowser) return;

    const storedCart = localStorage.getItem('cart');
    const storedCartDetails = localStorage.getItem('cartDetails');
    this.cart = storedCart ? JSON.parse(storedCart) : null;
    this.cartDetails = storedCartDetails ? JSON.parse(storedCartDetails) : [];
  }

  private isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public getUserID(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;

    const userInfo = this.authService.parseJwt(token);
    if (this.isBrowser) {
      localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      const storedUser = localStorage.getItem('loggedInUser');
      return storedUser ? JSON.parse(storedUser).userID : null;
    }
    return null;
  }

  private getAuthToken(): string | null {
    return this.authService.getToken();
  }

  public generateUniqueID(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  addToCart(cartRequest: CartRequest): Observable<any> {
    if (!this.isUserLoggedIn()) {
      alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return of(null);
    }

    const userID = this.getUserID();
    if (!userID) {
      alert('Không tìm thấy thông tin người dùng!');
      return of(null);
    }

    const token = this.getAuthToken();
    if (!token) {
      alert('Bạn cần đăng nhập lại để tiếp tục!');
      return of(null);
    }

    // If no cart exists, create a new one
    if (!this.cart) {
      this.cart = {
        cartID: this.generateUniqueID(),
        userID,
        createdDate: new Date()
      };
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const cartModel = {
      cartID: cartRequest.cartmodel.cartID,
      userID: cartRequest.cartmodel.userID,
      createdDate: cartRequest.cartmodel.createdDate
    };

    const cartDetailModel = {
      cartDetailID: this.generateUniqueID(),
      cartID: cartRequest.cartmodel.cartID,
      productID: cartRequest.cartdetail.productID,
      quantity: cartRequest.cartdetail.quantity,
      price: cartRequest.cartdetail.price,
      size: cartRequest.cartdetail.size,
      image: cartRequest.cartdetail.image
    };

    const payload = {
      cartModel,
      cartDetailModel
    };

    return this.http.post(this.apiUrl, payload, { headers }).pipe(
      map((response: any) => {
        console.log('Giỏ hàng và sản phẩm đã được thêm thành công:', response);
        this.cartDetails.push(cartDetailModel);
        this.saveCartToLocalStorage();
        return response;
      }),
      catchError((error) => {
        console.error('Lỗi khi thêm giỏ hàng và sản phẩm:', error);
        alert('Có lỗi khi thêm giỏ hàng và sản phẩm. Vui lòng thử lại! Error: ' + JSON.stringify(error)); // Thêm thông tin lỗi chi tiết
        return of(null);
      })
      
    );
  }

  private saveCartToLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
      localStorage.setItem('cartDetails', JSON.stringify(this.cartDetails));
    }
  }

  getCartDetails(userID: string): Observable<CartDetail[]> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiURLcartUserID}/${userID}`;
    return this.http.get<CartDetail[]>(url,{headers});
  }
  
  // getCartDetails():CartDetail[]{
  //   return this.cartDetails
  // }

  getTotalPrice(): number {
    return this.cartDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  }


  removeItem(productID: string, size: string): void {
    this.cartDetails = this.cartDetails.filter(item => item.productID !== productID || item.size !== size);
  }

  checkout(selectedItems: CartDetail[]): Observable<any> {
    // Thực hiện xử lý thanh toán ở đây (giả lập trả về kết quả thành công)
    console.log('Thanh toán các sản phẩm:', selectedItems);
    return of({ success: true });
  }

  updateCartDetail(cartdetaiID: number, size: string, quantity: number): Observable<CartDetail[]> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    
    // Tạo URL với query parameters
    const url = `${this.apiURLcartDetailUpdate}?cartDetailID=${cartdetaiID}&size=${size}&quantity=${quantity}`;
    
    // Gọi PUT request với headers và không có body (vì đang dùng query params)
    return this.http.put<CartDetail[]>(url, {}, { headers });
}

// Hàm xóa một sản phẩm từ giỏ hàng (sử dụng cartDetailID)
removeCartItem(cartDetailID: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const url = `${this.apiURLcartRemove}/${cartDetailID}`;
  return this.http.delete(url, { headers });
}

// Hàm xóa tất cả sản phẩm trong giỏ hàng (sử dụng cartID)
clearCart(cartID: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const url = `${this.apiURLcartClear}/${cartID}`;
  return this.http.delete(url, { headers });
}

}
