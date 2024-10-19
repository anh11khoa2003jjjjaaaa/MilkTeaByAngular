// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model'; // Import the Product model
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public apiUrlIMG: string = 'http://localhost:8080/IMG/';
  //private apiIMGUrl: string = 'http://localhost:8080/images'; // Địa chỉ của backend để phục vụ hình ảnh

  getImageUrl(imageUrl: string): string {
    console.log(`Image URL: ${imageUrl}`); // In ra giá trị của imageUrl
    return `${this.apiUrlIMG}${imageUrl}`;
  }
  
  private apiUrl = 'http://localhost:8080/public/product'; // Base API URL

  constructor(private http: HttpClient, private authService: AuthService ) { }

  // Get all products
  getAllProducts(): Observable<Product[]> {
    const token = this.authService.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/getAllProduct`;
    return this.http.get<Product[]>(url,{headers});
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
}
