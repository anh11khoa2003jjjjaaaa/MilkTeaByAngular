import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Product } from '../../../../../admin/src/app/models/product.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit {

  searchTerm: string = '';
  products: Product[] = [];
  message: string = '';
  isProductFound :boolean=false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Lấy searchTerm từ query params
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.searchProducts();
    });
  }
  getImageURL(imagePath: string): string {
    return this.productService.getImageUrl(imagePath);
  }
  searchProducts(): void {
    if (this.searchTerm) {
      this.productService.searchProduct(this.searchTerm).subscribe(
        (response) => {
          // Kiểm tra xem có sản phẩm không
          if (response.success && response.success.length > 0) {
            this.products = response.success;
            this.message = response.message;
            this.isProductFound = true;  // Đặt biến này là true khi tìm thấy sản phẩm
  
            // Cập nhật URL hình ảnh cho từng sản phẩm
            this.products.forEach(product => {
              product.imageURL = this.getImageURL(product.imageURL ?? '');
            });
          } else {
            this.products = [];
            this.isProductFound = false;  // Đặt biến này là false khi không tìm thấy sản phẩm
            this.message = `Không có sản phẩm nào phù hợp với tìm kiếm của bạn: ${this.searchTerm}.`;
          }
        },
        (error) => {
          console.error('Lỗi tìm kiếm sản phẩm:', error);
          this.products = [];
          this.isProductFound = false;  // Đặt biến này là false khi có lỗi
          this.message = `Đã xảy ra lỗi khi tìm kiếm sản phẩm "${this.searchTerm}".`;
        }
      );
    }
  }
  
}  

