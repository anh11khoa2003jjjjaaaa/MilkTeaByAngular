// import { Component, OnInit } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { Product } from '../../../../../admin/src/app/models/product.model';
// import { ProductService } from '../../../../../admin/src/app/services/product.service';
// import { AuthService } from '../../auth/auth.service';

// @Component({
//   selector: 'app-header-user',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './header-user.component.html',
//   styleUrl: './header-user.component.css'
// })
// export class HeaderUserComponent implements OnInit {
//   islogout: boolean=false;
//   ngOnInit(): void {
      
//   }

//   constructor(private account:AuthService, private router: Router){}
//   onLogout(): void {
//     this.account.logout(); // Gọi hàm logout từ AuthService
  
//     // Kiểm tra xem token có bị xóa hay không
//     if (!localStorage.getItem('token')) {
//       this.islogout = true; // Cập nhật trạng thái islogout
//       console.log("Đăng xuất thành công!");
//       this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
//     } else {
//       this.islogout = false;
//       console.log("Đăng xuất thất bại");
//     }
    
  
//     }
// }
import { Component, OnInit, ChangeDetectorRef, NgZone, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { UserService } from '../../service/user.service';
import { Category } from '../../../../../admin/src/app/models/category.model';
import { CategoryService } from '../../service/category.service';
import { Product } from '../../../../../admin/src/app/models/product.model';
import { ProductService } from '../../service/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule], // Import required modules
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  isLoggedIn: boolean = false;  // Track login state
  displayName: string | null = null;  // Store user's display name
  userID: string | null = null;  // Store user's ID
  categories: Category[] = [];  // List of categories
  searchResults: Product[] = [];  // To store the search results
  searchTerm: string = '';  // User's search term
  @Output() searchTermChanged: EventEmitter<string> = new EventEmitter<string>();   // Emit search event

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartservice: CartService,
    private categoryservice: CategoryService,
    private userService: UserService,
    private productService: ProductService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private route: ActivatedRoute,   // To ensure UI updates correctly
  ) {}

  ngOnInit(): void {
    // Check and retrieve stored display name if available
    const storedDisplayName = localStorage.getItem('displayName');
    console.log("Stored Display Name:", storedDisplayName);
    if (storedDisplayName) {
      this.displayName = storedDisplayName;
    }
    
    this.checkLoginState();  // Check if user is logged in
    this.loadCategories(); 
     // Load product categories
  }

  loadCategories() {
    this.categoryservice.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  checkLoginState(): void {
    const token = this.authService.getToken();
    if (token) {
      this.isLoggedIn = true;
      this.userID = this.cartservice.getUserID();  // Retrieve user ID from cart service

      if (this.userID) {
        // Fetch display name using the user ID
        this.userService.searchUserID(this.userID).subscribe({
          next: (name) => {
            this.displayName = name;
            localStorage.setItem('displayName', name);  // Store display name in localStorage
            this.changeDetectorRef.detectChanges();  // Force UI update
          },
          error: (err) => {
            console.error('Error fetching user name:', err);
          }
        });
      }
    } else {
      this.isLoggedIn = false;
      this.displayName = null;
    }
  }

  // Handle product search
//   Onsearch():void{
//     if (this.searchTerm.trim()) {
//     this.route.queryParams.subscribe(params => {
//           this.searchTerm = params['searchTerm'] || '';
          
//         });

//   }
// }
    //   this.route.queryParams.subscribe(params => {
  //     this.searchTerm = params['searchTerm'] || '';
  //     this.searchProducts();
  //   });
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProduct(this.searchTerm).subscribe({
        next: (products: Product[]) => {
          this.searchResults = products; 
           // Lưu kết quả tìm kiếm
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

  // Handle logout functionality
  onLogout(): void {
    this.authService.logout();  // Call logout from AuthService

    // Clear user information from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    localStorage.removeItem('userID');

    // Reset login state
    this.isLoggedIn = false;
    this.displayName = null;
    this.userID = null;

    // Navigate to login page
    this.router.navigate(['/loginUser']);
  }
}
