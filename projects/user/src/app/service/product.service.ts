// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../../admin/src/app/models/product.model'; // Import the Product model
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public apiUrlIMG: string = 'http://localhost:8080/IMG/';
  //private apiIMGUrl: string = 'http://localhost:8080/images'; // Địa chỉ của backend để phục vụ hình ảnh

  getImageUrl(imageUrl: string): string {
    console.log(`Image URL: ${this.apiUrlIMG}${imageUrl}`);
      // Kiểm tra xem imageUrl đã chứa 'http://localhost:8080/IMG/' hay chưa
  if (imageUrl.startsWith('http://localhost:8080/IMG/')) {
    // Nếu imageUrl đã bao gồm phần tiền tố, chỉ trả về URL hiện tại
    return imageUrl;
  } // In ra giá trị của imageUrl
    return `${this.apiUrlIMG}${imageUrl}`;
  }
  
  private apiUrl = 'http://localhost:8080/public/product'; // Base API URL

  constructor(private http: HttpClient, private authService: AuthService ) { }


  // getProducts(page: number, size: number): Observable<any> {
  //   const token = this.authService.getToken(); // Lấy token từ AuthService
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  //   const url = `${this.apiUrl}/paginationProduct`;
  //   let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
  //   return this.http.get<any>(url, {params,  headers });
  // }
  // Get all products
  getAllProducts(): Observable<Product[]> {
    // const token = this.authService.getToken(); // Lấy token từ AuthService
    // const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/getAllProduct`;
    return this.http.get<Product[]>(url);
  }


 
  // Search products by name or category
  searchProducts(searchTerm: string): Observable<Product[]> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/search?searchTerm=${searchTerm}`;
   
    return this.http.get<Product[]>(url,{headers});
  }


  // addProduct(product: Product, imageFile: File): Observable<Product> {
  //   const formData: FormData = new FormData();
  //   formData.append('product', JSON.stringify(product));
  //   formData.append('imageFile', imageFile);

  //   return this.http.post<Product>(this.apiUrl, formData, {
  //     headers: new HttpHeaders().set('Accept', 'application/json')
  //   });
  // }
  // Add a new product
  addProduct(product: FormData): Observable<Product> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    const url = `${this.apiUrl}/addproduct`;
  
    return this.http.post<Product>(url, product,{headers});
  }

  

  // Update an existing product by ID
  // Update product
  updateProduct(product: Product, imageFile: File | null): Observable<Product> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const formData = new FormData();

    // Append product JSON
    formData.append('product', JSON.stringify(product)); 

    // Append image file if provided
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const url = `${this.apiUrl}/update?productID=${product.productID}`;
    
    return this.http.put<Product>(url, formData, { headers });
}

  // updateProduct(product: Product): Observable<Product> {
  //   const token = this.authService.getToken(); // Lấy token từ AuthService
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  //   const url = `${this.apiUrl}/update?productID=${product.productID}`;
  //   return this.http.put<Product>(url, product, { headers });
  // }

  // Delete a product by ID
  deleteProduct(productID: string): Observable<void> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/deleteproduct?productID=${productID}`;
    return this.http.delete<void>(url,{headers});
  }

////////////////////
// Get product details by ID
getProductById(productID: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/product_detail`, { params: { productID } });
}

// Get related products based on categoryID
getRelatedProducts(productID: string): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/related`, { params: { productID } });
}


getProductNameById(productID: string): Observable<string> {
  const token = this.authService.getToken(); // Lấy token từ AuthService
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  const url = `${this.apiUrl}/${productID}/name`;

  return this.http.get<any>(url, { headers }).pipe(
    map(response => response.productName) // Lấy giá trị productName từ JSON trả về
  );
}

// Get product reviews
// getProductReviews(productID: string): Observable<ReviewModel[]> {
//   return this.http.get<ReviewModel[]>(`${this.apiBaseUrl}/${productID}/reviews`);
// }

// Add product to cart
addToCart(product: Product, quantity: number): void {
  // Implement cart logic (could be local storage or backend API call)
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push({ product, quantity });
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to favorites
addToFavorites(product: Product): void {
  // Implement favorites logic (could be local storage or backend API call)
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites.push(product);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

displayListProductByCategory(categoryID:string):Observable<Product[]>{
  const url = `${this.apiUrl}/DisplayListProductCategory_CategoryID/${categoryID}`;
  return this.http.get<Product[]>(url);
// Utility to get image URL
}


searchProduct(searchTerm: string): Observable<any> {
  const api = `${this.apiUrl}/search`;
  const params = new HttpParams().set('searchTerm', searchTerm);  // Thêm query parameter

  return this.http.get<any>(api, { params });
}

}
