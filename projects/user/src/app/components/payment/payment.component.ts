import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { CartService } from '../../service/cart.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { OrderRequest } from '../../models/OrderRequest';
import { AuthService } from '../../../../../admin/src/app/auth/auth.service';
import { UserService } from '../../service/user.service';
import { CartDetail } from '../../../../../admin/src/app/models/cartDetail.model';

@Component({
  selector: 'app-payment',
  standalone:true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [NgFor,CommonModule, NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule]
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  selectedCartItems: any[] = [];
  filteredUsers: any[] = [];
  totalAmount: number = 0;
  selectedUserId: string = '';


  cartItems: CartDetail[] = [];  // Điều chỉnh kiểu dữ liệu cho sản phẩm trong giỏ

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Initialize form with controls
    this.paymentForm = new FormGroup({
      orderID:new FormControl(''),
      displayName: new FormControl('', Validators.required),
      userID: new FormControl(''), // Added userID control for validation
      paymentMethodID: new FormControl('1', Validators.required),
      orderDate:new FormControl(''),
      orderStatus:new FormControl(''),
      totalAmount: new FormControl({ value: 0, disabled: true }) // Disabled because user shouldn't modify this directly
    });

    // Get selected cart items from local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      this.selectedCartItems = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
      // Update the total amount based on the selected items
      this.updateTotalAmount();
    }
  }

  // Function to calculate the total amount of selected cart items
  getTotalAmount(): number {
    return this.selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Update total amount in the form control
  updateTotalAmount(): void {
    this.totalAmount = this.getTotalAmount();
    this.paymentForm.patchValue({
      totalAmount: this.totalAmount // Update the total amount field in the form
    });
  }

  // Submit the payment data
  submitPayment() {
    if (this.paymentForm.valid) {
      // Get userID from selected user
      const selectedUser = this.filteredUsers.find(user => user.displayName === this.paymentForm.get('displayName')?.value);
  
      const paymentData: OrderRequest = {
        orderID: this.paymentForm.get('orderID')?.value,
        displayName: this.paymentForm.get('displayName')?.value,  // Send displayName to backend
        paymentMethodID: this.paymentForm.get('paymentMethodID')?.value,
        totalAmount: this.paymentForm.get('totalAmount')?.value,
        orderDate: this.paymentForm.get('orderDate')?.value,
        orderDetails: this.selectedCartItems.map(item => ({
          
          cartDetailID: item.cartDetailID,  // Send cartDetailID for each item
          productID: item.productID,
          quantity: item.quantity,
          size: item.size,
          price: item.price
        })),
        userID: selectedUser ? selectedUser.userID : '',  // Get userID from the selected user
        cancellationReason: '',  // Default empty cancellation reason
        orderStatus: 'Pending'  // Default order status is 'Pending'
      };
  
      console.log('Danh sách trước khi lưu:', paymentData);
  
      // Call API to create the order
      this.orderService.createOrder(paymentData).subscribe(
        (response) => {
          console.log('Order created successfully:', response);
          alert('Thanh toán thành công.');
  
          // Lấy danh sách cartDetailID của các sản phẩm đã thanh toán để xóa khỏi giỏ hàng
          paymentData.orderDetails.forEach((detail: any) => {
            this.onRemoveCartItem(detail.cartDetailID);
          });
  
          // Sau khi xóa sản phẩm khỏi giỏ hàng, xóa giỏ hàng khỏi localStorage
          localStorage.removeItem('selectedCartItems');
  
          // Chuyển hướng đến trang xác nhận đơn hàng
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error creating order:', error);
          alert('Có lỗi khi tạo đơn hàng.');
        }
      );
    } else {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
    }
  }
  
  // submitPayment() {
  //   if (this.paymentForm.valid) {
  //     // Get userID from selected user
  //     const selectedUser = this.filteredUsers.find(user => user.displayName === this.paymentForm.get('displayName')?.value);

  //     const paymentData: OrderRequest = {
  //       orderID:this.paymentForm.get('orderID')?.value,
  //       displayName: this.paymentForm.get('displayName')?.value,  // Send displayName to backend
  //       paymentMethodID: this.paymentForm.get('paymentMethodID')?.value,
  //       totalAmount: this.paymentForm.get('totalAmount')?.value,
  //       orderDate:this.paymentForm.get('orderDate')?.value,
        
  //       orderDetails: this.selectedCartItems.map(item => ({
  //         cartDetailID:item.cartdetaiID,//new
  //         productID: item.productID,
  //         quantity: item.quantity,
  //         size: item.size,
  //         price: item.price
  //       })),
  //       userID: selectedUser ? selectedUser.userID : '',  // Get userID from the selected user
  //       cancellationReason: '',  // Default empty cancellation reason
  //       orderStatus: 'Pending'  // Default order status is 'Pending'
  //     };
  //     console.log('Danh dách trước khi lưu:', paymentData);
  //     // Call API to create the order
  //     this.orderService.createOrder(paymentData).subscribe(
  //       (response) => {
  //         console.log('Order created successfully:', response);
  //         alert('Thanh toán thành công.');
        
  //         this.router.navigate(['/order-confirmation', response.orderID]); 
  //         // Redirect or handle post-payment logic here
  //       },
  //       (error) => {
  //         console.error('Error creating order:', error);
  //         alert('Có lỗi khi tạo đơn hàng.');
  //       }
  //     );
  //   } else {
  //     alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      
  //   }
  // }

  onRemoveCartItem(cartDetailID: number): void {
    this.cartService.removeCartItem(cartDetailID).subscribe(response => {
      alert('Sản phẩm đã được xóa khỏi giỏ hàng!');
      this.loadCart();
       // Tải lại giỏ hàng sau khi xóa
    }, error => {
      console.error('Lỗi xóa sản phẩm khỏi giỏ hàng:', error);
      alert('Lỗi: Không thể xóa sản phẩm khỏi giỏ hàng.');
    });
  }
  // Handle user selection from the autocomplete list
  onUserSelected(event: any) {
    // Tìm userID từ selected user
    const selectedUserID = event.option.value;
    const selectedUser = this.filteredUsers.find(user => user.userID === selectedUserID);
    
    if (selectedUser) {
      console.log('User selected:', selectedUser);  // Log thông tin người dùng được chọn
      console.log('UserID:', selectedUser.userID);  // Log userID của người dùng đã chọn
  
      // Cập nhật form với userID
      this.paymentForm.get('userID')?.setValue(selectedUser.userID);
    } else {
      console.error('User not found');
    }
  }
  
  // Search for users when the user types in the displayName field
  onUserInput(event: Event) {
    const input = event.target as HTMLInputElement | null;  // Ép kiểu và kiểm tra null
    if (input) {  // Kiểm tra nếu input không phải là null
      const displayName = input.value;
    
      console.log("Searching for user with name:", displayName); // Debug log tên người dùng nhập vào
    
      if (displayName) {
        this.userService.searchUser(displayName).subscribe(
          (response) => {
            console.log('User search results:', response);  // Log kết quả tìm kiếm người dùng
            this.filteredUsers = response;  // Lưu danh sách người dùng sau khi tìm kiếm
          },
          (error) => {
            console.error('Error fetching users', error);
          }
        );
      } else {
        this.filteredUsers = [];
      }
    } else {
      console.error('Input element not found!');
    }
  }

  loadCart(): void {
    const userID = this.cartService.getUserID();
    // Log để kiểm tra // Lấy userID từ sessionStorage
    if (userID) {
      this.cartItems = [];  // Khởi tạo lại giỏ hàng
      this.totalAmount = 0; 
     this.cartService.getCartDetails(userID);
    this.updateTotalAmount();  // Cập nhật lại tổng số tiền sau khi tải lại giỏ hàng
  }else{


  }


  
}
}
