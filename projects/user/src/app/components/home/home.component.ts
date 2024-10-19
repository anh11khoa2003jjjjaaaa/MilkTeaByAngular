// import { Component, OnInit } from '@angular/core';
// import { routes } from '../../app.routes';
// import { RouterModule } from '@angular/router';
// import { Product } from '../../../../../admin/src/app/models/product.model';
// import { ProductService } from '../../service/product.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule, CurrencyPipe, NgFor, NumberSymbol } from '@angular/common';
// import { forkJoin } from 'rxjs';
// import { CategoryService } from '../../service/category.service';
// import { Category } from '../../../../../admin/src/app/models/category.model';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [RouterModule,FormsModule,NgFor, CurrencyPipe,CommonModule],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css'
// })
// export class HomeComponent  implements OnInit {
//   products :Product[]=[];
//   categories :Category[]=[];
//   currentPage: number = 1; // Trang hiện tại
//   pageSize: number = 6; // Số sản phẩm mỗi trang
//   totalItems: number = 0;
//   pageNumbers: number[] = [];
//     // Biến lưu trữ danh sách sản phẩm
//   searchResults: Product[] = []; // Tổng số sản phẩm
//   constructor(private productService: ProductService, private categoryService:CategoryService){
//  }
 
//  ngOnInit(): void {
//   this.loadProducts();
//  }
 
//  getImageUrl(imageUrl: string): string {
//   return this.productService.getImageUrl(imageUrl ?? '');
// }

// //Hàm để chuyển categoryID trong bảng product sang categoryName
// mapCategoryName(products: Product[]) {
//   products.forEach(product => {
//     const category = this.categories.find(cat => cat.categoryID === product.categoryID);
//     if (category) {
//       product.categoryName = category.categoryName; // Gán tên danh mục cho product
//     }
//   });
// }
// loadProducts(): void {
//   // Dùng để hiện thị CategoyID thành CategoryName
//   forkJoin({
//     products: this.productService.getAllProducts(),
//     categories: this.categoryService.getAllCategories()
//   }).subscribe(
//     ({ products, categories }) => {
//       this.products = products;
//       this.categories = categories;
    

//       console.log('Categories:', this.categories); // Kiểm tra danh mục
//       console.log('Products:', this.products);     // Kiểm tra sản phẩm

//       this.mapCategoryName(this.products);
//       console.log('Products with Category Name:', this.products); // Kiểm tra sau khi ánh xạ tên danh mục

   

//       // Sau khi load lại dữ liệu, thêm timestamp để load lại hình ảnh không bị cache
//       this.products.forEach(product => {
//         product.imageURL = this.getImageUrl(product.imageURL?? '');
//       });
//     },
//     error => console.error('Error loading products', error)
//   );
// }
// onSearch(searchResults: Product[]): void {
//   this.searchResults = searchResults;
// }

// }
// HomeComponent
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../../../admin/src/app/models/product.model';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../../../../admin/src/app/models/category.model';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../admin/src/app/header/header.component';
import { HeaderUserComponent } from '../header-user/header-user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CurrencyPipe, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchResults: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalItems: number = 0;
  pageNumbers: number[] = [];
  searchTerm: string = ''; // Biến tìm kiếm
  @ViewChild(HeaderUserComponent) headerComponent!: HeaderUserComponent; 

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts(); 
    this.showSlides(this.slideIndex); // Initially load products
  }
  showSlides(n: number): void {
    const slides = this.slides.length;
    if (n > slides) { this.slideIndex = 1; }
    if (n < 1) { this.slideIndex = slides; }
  }
  moveSlides(n: number): void {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n: number): void {
    this.showSlides(this.slideIndex = n);
  }
  slideIndex = 1;
  slides = [
    { imageURL: 'https://blog.dktcdn.net/files/thiet-ke-quan-tra-sua-nho-gia-re-1.jpg', altText: 'Slide 1' },
    { imageURL: 'https://mixuediemdien.com/wp-content/uploads/2023/07/Tra-Sua-Nuong.jpg', altText: 'Slide 2' },
    { imageURL: '', altText: 'Slide 3' }
  ];
  ngAfterViewInit(): void {
    // Listen for search term changes from HeaderUserComponent
    if (this.headerComponent) {
      this.headerComponent.searchTermChanged.subscribe((searchTerm: string) => {
        this.searchTerm = searchTerm;  // Update searchTerm
        this.loadProducts();  // Reload products based on the search term
      });
    }
  }
 // Update page numbers for pagination

  // Get image URL for the product
  getImageUrl(imageUrl: string): string {
    return this.productService.getImageUrl(imageUrl ?? '');
  }

  // Map CategoryID to CategoryName
  mapCategoryName(products: Product[]) {
    products.forEach(product => {
      const category = this.categories.find(
        cat => cat.categoryID === product.categoryID
      );
      if (category) {
        product.categoryName = category.categoryName;
      }
    });
  }

  // Load products based on searchTerm or all products if empty
  loadProducts(): void {
    if (this.searchTerm.trim() !== '') {
      // Search for products based on the search term
      this.productService.searchProduct(this.searchTerm).subscribe(
        (products) => {
          this.products = products;
          this.categories = []; // Categories won't be used in search
          this.mapCategoryName(this.products);
          this.totalItems = this.products.length;
          this.updatePageNumbers();
          this.applyPagination();
          console.log('Search Results:', this.products);
        },
        (error) => console.error('Error searching products:', error)
      );
    } else {
      // Load all products and categories if no search term
      forkJoin({
        products: this.productService.getAllProducts(),
        categories: this.categoryService.getAllCategories()
      }).subscribe(
        ({ products, categories }) => {
          this.products = products;
          this.categories = categories;
          this.mapCategoryName(this.products);
          this.totalItems = this.products.length;
          this.updatePageNumbers();
          this.applyPagination();
          console.log('Products:', this.products);
          console.log('Categories:', this.categories);

          this.products.forEach(product => {
            product.imageURL = this.getImageUrl(product.imageURL ?? '');
          });
        },
        (error) => console.error('Error loading products:', error)
      );
    }
  }

  // Update page numbers for pagination
  updatePageNumbers(): void {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProduct(this.searchTerm).subscribe({
        next: (products: Product[]) => {
          this.searchResults = products;  // Lưu kết quả tìm kiếm
          console.log('Search results:', this.searchResults);
        },
        error: (err) => {
          console.error('Error searching products:', err);
        }
      });
    } else {
      // Nếu không có từ khóa tìm kiếm, trả lại danh sách sản phẩm ban đầu
      this.searchResults = [];
      console.log('No search term, showing all products.');
    }
  }
  // Apply pagination to the products list
  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = this.products.slice(startIndex, endIndex);
  }

  // Go to a specific page for pagination
  goToPage(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }
}
