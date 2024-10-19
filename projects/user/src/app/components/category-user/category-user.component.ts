import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../service/product.service';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../../admin/src/app/models/product.model';

@Component({
  selector: 'app-category-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-user.component.html',
  styleUrls: ['./category-user.component.css']
})
export class CategoryUserComponent implements OnInit {
  products: Product[] = [];
  categoryID: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Thay thế snapshot bằng paramMap với subscribe để lắng nghe sự thay đổi
    this.route.paramMap.subscribe(params => {
      this.categoryID = params.get('categoryID');
      if (this.categoryID) {
        this.loadListProductByCategoryID(this.categoryID);
      }
    });
  }

  // Hàm gọi API để lấy danh sách sản phẩm theo categoryID
  loadListProductByCategoryID(categoryID: string) {
    this.productService.displayListProductByCategory(categoryID).subscribe(
      (data) => {
        this.products = data;
        this.products.forEach(product => {
          product.imageURL = this.getImageURL(product.imageURL ?? '');
        });
      },
      (error) => {
        console.error('Error loading products by category', error);
      }
    );
  }

  // Hàm tạo URL hình ảnh từ service
  getImageURL(imagePath: string): string {
    return this.productService.getImageUrl(imagePath);
  }
}
