// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../service/cart.service';
// import { CartDetail } from '../../../../../admin/src/app/models/cartDetail.model';
// import { NgFor, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../service/product.service';
// import { Product } from '../../../../../admin/src/app/models/product.model';

// @Component({
//   selector: 'app-carts',
//   standalone:true,
//   templateUrl: './carts.component.html',
//   styleUrls: ['./carts.component.css'],
//   imports:[NgIf,NgFor,FormsModule],
// })
// export class CartsComponent implements OnInit {
//   cartItems: CartDetail[] = [];  // Điều chỉnh kiểu dữ liệu cho sản phẩm trong giỏ
//   totalAmount: number = 0;

//   constructor(private cartService: CartService,private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadCart();  // Gọi hàm để load giỏ hàng khi component khởi tạo
//   }

//   // loadCart(): void {
//   //   this.cartItems = this.cartService.getCartDetails();  // Lấy chi tiết giỏ hàng
//   //   this.totalAmount = this.cartService.getTotalPrice();  // Tính tổng số tiền
//   // }
//   getImageUrl(imageUrl: string): string {
//     return this.productService.getImageUrl(imageUrl ?? '');
//   }
  
// //   loadCart(): void {
// //     const userID = sessionStorage.getItem('userID');  // Lấy userID từ sessionStorage
// //     if (userID) {
// //       const cartDetails = this.cartService.getCartDetails(userID);  // Truy vấn giỏ hàng theo userID
// //       this.cartItems = [];
// //     cartDetails.forEach(item => {
// //       this.productService.getProductById(item.productID).subscribe(product => {
        
// //         // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
// //         const existingItem = this.cartItems.find(cartItem => cartItem.productID === item.productID && cartItem.size === item.size);
        
// //         if (existingItem) {
// //           // Nếu có, tăng số lượng sản phẩm lên
// //           existingItem.quantity += item.quantity;
// //         } else {
// //           // Nếu không có, thêm sản phẩm mới vào giỏ hàng
// //           this.cartItems.push({
// //             cartDetailID: item.cartDetailID,
// //             cartID: item.cartID,
// //             productID: item.productID,
// //             productName: product ? product.productName : 'Không tìm thấy sản phẩm',
// //             price: product ? product.price : 0,
// //             quantity: item.quantity,
// //             size: item.size,
// //             image: item.image
// //           });
// //         }

// //         // Tính tổng tiền mỗi lần có sản phẩm mới hoặc đã tăng số lượng
// //         this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// //       });
// //     });
// // }

// // }
// loadCart(): void {
//   const userID = this.cartService.getUserID(); // Lấy userID từ sessionStorage
//   if (userID) {
//     this.cartItems = [];  // Khởi tạo lại giỏ hàng
//     this.totalAmount = 0; // Đặt lại tổng tiền về 0

//     // Lấy chi tiết giỏ hàng theo userID
//     this.cartService.getCartDetails(userID).subscribe(cartDetails => {
//       cartDetails.forEach(item => {
//         // Lấy thông tin chi tiết của từng sản phẩm
//         this.productService.getProductById(item.productID).subscribe(product => {

//           // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
//           const existingItem = this.cartItems.find(cartItem => 
//             cartItem.productID === item.productID && cartItem.size === item.size
//           );

//           if (existingItem) {
//             // Nếu có, tăng số lượng sản phẩm lên
//             existingItem.quantity += item.quantity;
//           } else {
//             // Nếu không có, thêm sản phẩm mới vào giỏ hàng
//             this.cartItems.push({
//               cartDetailID: item.cartDetailID,
//               cartID: item.cartID,
//               productID: item.productID,
//               productName: product ? product.productName : 'Không tìm thấy sản phẩm',
//               price: product ? product.price : 0,
//               quantity: item.quantity,
//               size: item.size,
//               image: item.image
//             });
//           }

//           // Cập nhật tổng tiền
//           this.updateTotalAmount();
//         });
//       });
//     });
//   } else {
//     console.error("Không tìm thấy userID trong sessionStorage.");
//   }
// }

// // Hàm cập nhật tổng tiền
// updateTotalAmount(): void {
//   this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// }


// // Hàm cập nhật tổng tiền giỏ hàng


  
  
//   // removeItem(productID: number, size: string): void {
//   //   this.cartService.removeItem(productID, size);  // Gọi hàm xóa sản phẩm khỏi giỏ
//   //   this.loadCart();  // Cập nhật lại giỏ hàng sau khi xóa
//   // }

//   clearCart(): void {
//     this.cartService.clearCart();  // Gọi hàm để xóa toàn bộ giỏ hàng
//     this.loadCart();  // Cập nhật lại giỏ hàng
//   }
// }
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CartDetail } from '../../../../../admin/src/app/models/cartDetail.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { Product } from '../../../../../admin/src/app/models/product.model';
import { PaymentService } from '../../service/payment.service';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {NgxPrintModule} from 'ngx-print';
@Component({
  selector: 'app-carts',
  standalone:true,
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css'],
  imports:[NgIf,NgFor,FormsModule,CommonModule,ReactiveFormsModule, RouterModule,NgxPrintModule],
})
export class CartsComponent implements OnInit {
  cartItems: CartDetail[] = [];  // Điều chỉnh kiểu dữ liệu cho sản phẩm trong giỏ
  totalAmount: number = 0;
  availableSizes = ['Nhỏ', 'Vừa', 'Lớn']; 
  selectedCartItem: any = null;
  updateCartForm: FormGroup;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router:Router,private cartService: CartService,private productService: ProductService,private fb: FormBuilder,private paymentServices:PaymentService) {

    this.updateCartForm = this.fb.group({
      size: [''],
      quantity: ['']
    });
  }


  ngOnInit(): void {
    this.loadCart();  // Gọi hàm để load giỏ hàng khi component khởi tạo
  }

  getImageUrl(imageUrl: string): string {
    return this.productService.getImageUrl(imageUrl ?? '');
  }

  loadCart(): void {
    const userID = this.cartService.getUserID();
    // Log để kiểm tra // Lấy userID từ sessionStorage
    if (userID) {
      this.cartItems = [];  // Khởi tạo lại giỏ hàng
      this.totalAmount = 0; 
      // Đặt lại tổng tiền về 0

      // Lấy chi tiết giỏ hàng theo userID
      this.cartService.getCartDetails(userID).subscribe(cartDetails => {
        cartDetails.forEach(item => {
          // Lấy thông tin chi tiết của từng sản phẩm
          this.productService.getProductById(item.productID).subscribe(product => {
            const existingItem = this.cartItems.find(cartItem => 
              cartItem.productID === item.productID && cartItem.size === item.size
            );

            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              this.cartItems.push({
                cartDetailID: item.cartDetailID,
                cartID: item.cartID,
                productID: item.productID,
                productName: product ? product.productName : 'Không tìm thấy sản phẩm',
                price: product ? product.price : 0,
                quantity: item.quantity,
                size: item.size,
                image: item.image,
                selected: false  // Thêm thuộc tính để kiểm tra sản phẩm đã chọn
              });
            }
            this.updateTotalAmount();
          });
        });
      });
    }
  }


  // Xóa một sản phẩm khỏi giỏ
  removeItem(productID: string, size: string): void {
    this.cartService.removeItem(productID, size);  // Gọi hàm xóa sản phẩm khỏi giỏ
    this.loadCart();  // Cập nhật lại giỏ hàng sau khi xóa
  }



 
  
  openUpdateCartModal(item: any) {
    const modal=document.getElementById("updateCartModal");
    if(modal!=null){
    modal.style.display="block";
    }
    this.selectedCartItem = item;
    this.updateCartForm.setValue({
      size: item.size,
      quantity: item.quantity
    });
    // Hiển thị modal (nếu sử dụng jQuery hoặc bootstrap modal)
    
  }




  // Function to update the cart item when the size or quantity changes
  updateCartItem(productID: string, newSize: string, newQuantity: number): void {
    // Find the cart item based on productID
    const cartItem = this.cartItems.find(item => item.productID === productID);

    if (cartItem) {
      // Update the size and quantity of the cart item
      cartItem.size = newSize;
      cartItem.quantity = newQuantity;

      // Update the total amount
      this.updateTotalAmount();
    }
  }
  updateTotalAmount(): void {
    this.totalAmount = this.cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }
// Xử lý cập nhật sản phẩm trong giỏ hàng
onUpdateCart() {
  if (this.updateCartForm.valid && this.selectedCartItem) {
    const updatedSize = this.updateCartForm.get('size')?.value;
    const updatedQuantity = this.updateCartForm.get('quantity')?.value;
    console.log('Cập nhật giỏ hàng với:', { size: updatedSize, quantity: updatedQuantity });
    this.cartService.updateCartDetail(
      this.selectedCartItem.cartDetailID, 
      updatedSize, 
      updatedQuantity
    ).subscribe(response => {
      alert('Cập nhật giỏ hàng thành công!');
      this.loadCart();  // Tải lại giỏ hàng sau khi cập nhật
    }, error => {
      console.error('Lỗi cập nhật giỏ hàng:', error);
      alert('Cập nhật giỏ hàng thất bại.');
    });

    // Ẩn modal sau khi cập nhật
    const modal = document.getElementById("updateCartModal");
    if (modal) {
      modal.style.display = "none";
    }
  }
}

// Xử lý thanh toán (checkout)

  closeUpdateCartForm() {
    this.selectedCartItem = null;
    const modal=document.getElementById("updateCartModal");
    if(modal!=null){
    modal.style.display="none";
    }
  }
  // Hàm xóa một sản phẩm từ giỏ hàng
  onRemoveCartItem(cartDetailID: number): void {
    this.cartService.removeCartItem(cartDetailID).subscribe(response => {
      alert('Sản phẩm đã được xóa khỏi giỏ hàng!');
      this.loadCart(); // Tải lại giỏ hàng sau khi xóa
    }, error => {
      console.error('Lỗi xóa sản phẩm khỏi giỏ hàng:', error);
      alert('Lỗi: Không thể xóa sản phẩm khỏi giỏ hàng.');
    });
  }
  onProductSelect(item: CartDetail): void {
    console.log('Selected item before change:', item.selected);  // Log trước khi thay đổi
    item.selected = !item.selected;
    console.log('Selected item after change:', item.selected);   // Log sau khi thay đổi
  
    // Cập nhật lại vào localStorage
    let selectedItems = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
    console.log('Lấy giá trị được chọn :', selectedItems);
    if (item.selected) {
      selectedItems.push(item);
    } else {
      selectedItems = selectedItems.filter((i: any) => i.cartDetailID !== item.cartDetailID);
    }
  
     let saveselectd=localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    console.log('Lưu giá trị được chọn :', saveselectd);
    // Cập nhật lại cartItems để Angular phát hiện thay đổi
    this.cartItems = [...this.cartItems];
  }
  

  proceedToPayment(): void {
    const selectedItems = this.cartItems.filter(item => item.selected === true);  // Lọc các sản phẩm đã chọn
    console.log('Selected items for payment:', selectedItems);
  
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
  
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    this.router.navigate(['/payment']);
  }
  
  
  
    
  
}
