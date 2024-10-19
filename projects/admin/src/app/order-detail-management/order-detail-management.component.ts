// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OrderRequest } from '../../../../user/src/app/models/OrderRequest';
// import { OrderService } from '../../../../user/src/app/service/order.service';
// import { CommonModule, NgFor, NgIf } from '@angular/common';
// import { UserService } from '../../../../user/src/app/service/user.service';
// import { ProductService } from '../../../../user/src/app/service/product.service';
// import { forkJoin } from 'rxjs'; 
// @Component({
//   selector: 'app-order-detail-management',
//   standalone: true,
//   templateUrl: './order-detail-management.component.html',
//   styleUrls: ['./order-detail-management.component.css'],
//   imports: [FormsModule, NgFor, NgIf, ReactiveFormsModule, CommonModule],
// })
// export class OrderDetailManagementComponent implements OnInit {
//   orders: OrderRequest[] = [];
//   searchForm: FormGroup;
//   approveOrderForm: FormGroup;
//   hasOrders: boolean = false;
//   selectedOrder: OrderRequest | null = null;

//   constructor(
//     private orderService: OrderService,
//     private fb: FormBuilder,
//     private userService: UserService,
//     private productService:ProductService
//   ) {
//     // Initialize the search form
//     this.searchForm = this.fb.group({
//       searchTerm: [''],
//     });

//     // Initialize the approve form with status selection
//     this.approveOrderForm = this.fb.group({
//       orderID: [''],
//       orderStatus: ['Đã duyệt'], // Default value set to 'Đã duyệt'
//     });
//   }

//   ngOnInit(): void {
//     this.fetchOrders(); // Load all orders on initialization
//   }

//   // // Fetch all orders from the server
//   // fetchOrders(): void {
//   //   this.orderService.getAll().subscribe(
//   //     (data: OrderRequest[]) => {
//   //       this.orders = data;
//   //       this.hasOrders = this.orders.length > 0;

//   //       // Map display names for users
//   //       this.orders.forEach((order) => {
//   //         if (order.userID) {
//   //           this.userService.searchUserID(order.userID).subscribe(
//   //             (displayName) => {
//   //               order.displayName = displayName;
//   //             },
//   //             (error) => {
//   //               console.error(`Error fetching displayName for userID ${order.userID}:`, error);
//   //             }
//   //           );
//   //         }
//   //       });
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching orders:', error);
//   //       this.hasOrders = false;
//   //     }
//   //   );
//   // }
//   // fetchOrders(): void {
//   //   this.orderService.getAll().subscribe(
//   //     (data: OrderRequest[]) => {
//   //       this.orders = data;
//   //       this.hasOrders = this.orders.length > 0;
  
//   //       // Map display names for users and fetch detailed order info
//   //       this.orders.forEach((order) => {
//   //         if (order.userID) {
//   //           this.userService.searchUserID(order.userID).subscribe(
//   //             (displayName) => {
//   //               order.displayName = displayName;
//   //             },
//   //             (error) => {
//   //               console.error(`Error fetching displayName for userID ${order.userID}:`, error);
//   //             }
//   //           );
//   //         }
  
//   //         // Fetch detailed order info by orderId
//   //         this.orderService.getOrderById(order.orderID).subscribe(
//   //           (orderDetails) => {
//   //             // Add product details to each order
//   //             order.orderDetails = orderDetails.products;
  
//   //             // Replace productID with productName for each product
//   //             order.orderDetails.forEach((product:any) => {
//   //               this.productService.getProductNameById(product.productID).subscribe(
//   //                 (productName) => {
//   //                   product.productName = productName;  // Replace productID with productName
//   //                 },
//   //                 (error) => {
//   //                   console.error(`Error fetching productName for productID ${product.productID}:`, error);
//   //                 }
//   //               );
//   //             });
//   //           },
//   //           (error) => {
//   //             console.error(`Error fetching order details for orderID ${order.orderID}:`, error);
//   //           }
//   //         );
//   //       });
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching orders:', error);
//   //       this.hasOrders = false;
//   //     }
//   //   );
//   // }
//     // Fetch all orders and map additional user and product data
//    // Import forkJoin từ rxjs

//     fetchOrders(): void {
//       this.orderService.getAll().subscribe(
//         (data: OrderRequest[]) => {
//           this.orders = data;
//           this.hasOrders = this.orders.length > 0;
    
//           // Duyệt qua từng đơn hàng và gọi API lấy thông tin người dùng và chi tiết đơn hàng
//           this.orders.forEach((order) => {
//             this.fetchUserDisplayName(order);
//             this.fetchOrderDetailsWithProducts(order);
//           });
//         },
//         (error) => {
//           console.error('Error fetching orders:', error);
//           this.hasOrders = false;
//         }
//       );
//     }
    
//     // Hàm lấy tên người dùng
//     private fetchUserDisplayName(order: any): void {
//       if (order.userID) {
//         this.userService.searchUserID(order.userID).subscribe(
//           (displayName) => {
//             order.displayName = displayName;
//           },
//           (error) => {
//             console.error(`Error fetching displayName for userID ${order.userID}:`, error);
//           }
//         );
//       }
//     }
    
//     // Hàm lấy chi tiết đơn hàng và tên sản phẩm
//    private fetchOrderDetailsWithProducts(order: OrderRequest): void {
//   this.orderService.getOrderById(order.orderID).subscribe(
//     (orderDetails) => {
//       order.orderDetails = orderDetails.orderDetails; // Corrected line
//       console.log("Chi tiết đơn hàng", orderDetails);

//       const productRequests = order.orderDetails.map((product: any) => {
//         return this.productService.getProductNameById(product.productID);
//       });

//       // When all product names are retrieved, update them in the order details
//       forkJoin(productRequests).subscribe(
//         (productNames: string[]) => {
//           // Assign product names to the respective products
//           order.orderDetails.forEach((product: any, index: number) => {
//             product.productName = productNames[index]; // Assign product name
//           });
//         },
//         (error) => {
//           console.error('Error fetching product names:', error);
//         }
//       );
//     },
//     (error) => {
//       console.error(`Error fetching order details for orderID ${order.orderID}:`, error);
//     }
//   );
// }

    
//   // Search for orders based on search term
//   onSearch(): void {
//     const searchTerm = this.searchForm.get('searchTerm')?.value;

//     if (searchTerm) {
//       this.orders = this.orders.filter((order) =>
//         order.orderID.toString().includes(searchTerm) ||
//         order.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     } else {
//       this.fetchOrders(); // Reset orders if search term is empty
//     }
//   }

//   // Open the approve modal and load the selected order
//   openApproveModal(order: OrderRequest): void {
//     this.selectedOrder = order;
//     this.approveOrderForm.patchValue({
//       orderID: order.orderID,
//       orderStatus: 'Đã duyệt' // Defaulting to 'Đã duyệt'
//     });
//     this.showModal('approveOrderModal'); // Show the modal for approving the order
//   }

//   // Approve order with selected status
//   onApprove(): void {
//     const orderID = this.approveOrderForm.get('orderID')?.value;
//     const orderStatus = this.approveOrderForm.get('orderStatus')?.value;

//     if (orderID && orderStatus) {
//       this.orderService.approveOrder(orderID, orderStatus).subscribe(
//         (response) => {
//           console.log('Order approved:', response);
//           this.fetchOrders(); // Refresh the orders after approval
//           this.CloseFormApprove(); // Close the modal after success
//         },
//         (error) => {
//           console.error('Error approving order:', error);
//         }
//       );
//     }
//   }

//   // Check if an order is pending approval
//   isPending(order: OrderRequest): boolean {
//     return order.orderStatus === 'Pending';
//   }

//   // Show modal by ID
//   showModal(modalId: string): void {
//     const modal = document.getElementById(modalId);
//     if (modal) {
//       modal.style.display = 'block';
//     }
//   }

//   // Close approve modal
//   CloseFormApprove(): void {
//     this.selectedOrder = null; // Reset selected order
//     this.hideModal('approveOrderModal'); // Hide modal
//   }

//   // Open order detail modal
//   openOrderDetailModal(order: OrderRequest): void {
//     this.selectedOrder = order;
//  console.log(this.selectedOrder);

//     // Check if orderDetails exists, if not, assign an empty array to avoid errors
//     if (!this.selectedOrder.orderDetails) {
//       this.selectedOrder.orderDetails = [];
//     }
  
//     this.showModal('orderDetailModal'); // Show the order detail modal
//   }

//   // Close order detail modal
//   CloseFormDetail(): void {
//     this.selectedOrder = null; // Reset selected order
//     this.hideModal('orderDetailModal'); // Hide modal
//   }

//   // Hide modal by ID
//   hideModal(modalId: string): void {
//     const modal = document.getElementById(modalId);
//     if (modal) {
//       modal.style.display = 'none';
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderRequest } from '../../../../user/src/app/models/OrderRequest';
import { OrderService } from '../../../../user/src/app/service/order.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../../../user/src/app/service/user.service';
import { ProductService } from '../../../../user/src/app/service/product.service';
import { forkJoin } from 'rxjs'; 
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-order-detail-management',
  standalone: true,
  templateUrl: './order-detail-management.component.html',
  styleUrls: ['./order-detail-management.component.css'],
  imports: [FormsModule, NgFor, NgIf, ReactiveFormsModule,NgxPrintModule, CommonModule],
})
export class OrderDetailManagementComponent implements OnInit {
  orders: OrderRequest[] = [];
  searchForm: FormGroup;
  approveOrderForm: FormGroup;
  hasOrders: boolean = false;
  selectedOrder: OrderRequest | null = null;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private userService: UserService,
    private productService: ProductService
  ) {
    // Initialize the search form
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });

    // Initialize the approve form with status selection
    this.approveOrderForm = this.fb.group({
      orderID: [''],
      orderStatus: ['Đã duyệt'], // Default value set to 'Đã duyệt'
    });
  }

  ngOnInit(): void {
    this.fetchOrders(); // Load all orders on initialization
  }

  // Fetch all orders and map additional user and product data
  fetchOrders(): void {
    this.orderService.getAll().subscribe(
      (data: OrderRequest[]) => {
        this.orders = data;
        this.hasOrders = this.orders.length > 0;

        // Iterate through each order and call APIs to get user info and order details
        this.orders.forEach((order) => {
          this.fetchUserDisplayName(order);
          this.fetchOrderDetailsWithProducts(order);
        });
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.hasOrders = false;
      }
    );
  }

  // Get the display name of the user by userID
  private fetchUserDisplayName(order: any): void {
    if (order.userID) {
      this.userService.searchUserID(order.userID).subscribe(
        (displayName) => {
          order.displayName = displayName;
        },
        (error) => {
          console.error(`Error fetching displayName for userID ${order.userID}:`, error);
        }
      );
    }
  }

  // Get order details and product names
  private fetchOrderDetailsWithProducts(order: OrderRequest): void {
    this.orderService.getOrderById(order.orderID).subscribe(
      (orderDetails) => {
        order.orderDetails = orderDetails.orderDetails; // Get order details

        const productRequests = order.orderDetails.map((product: any) => {
          return this.productService.getProductNameById(product.productID);
        });
console.log("Sản phẩm đươn hàng",productRequests);
        // Update product names once all product data is retrieved
        forkJoin(productRequests).subscribe(
          (productNames: string[]) => {
            order.orderDetails.forEach((product: any, index: number) => {
              product.productName = productNames[index]; // Replace productID with productName
            });
          },
          (error) => {
            console.error('Error fetching product names:', error);
          }
        );
      },
      (error) => {
        console.error(`Error fetching order details for orderID ${order.orderID}:`, error);
      }
    );
  }

  // Search orders by term (orderID, displayName, or orderStatus)
  onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;

    if (searchTerm) {
      this.orders = this.orders.filter((order) =>
        order.orderID.toString().includes(searchTerm) ||
        order.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.fetchOrders(); // Reset orders if search term is empty
    }
  }

  // Open modal to approve an order
  openApproveModal(order: OrderRequest): void {
    this.selectedOrder = order;
    this.approveOrderForm.patchValue({
      orderID: order.orderID,
      orderStatus: 'Đã duyệt' // Default to 'Đã duyệt'
    });
    this.showModal('approveOrderModal'); // Show approve modal
  }

  // Approve order with selected status
  onApprove(): void {
    const orderID = this.approveOrderForm.get('orderID')?.value;
    const orderStatus = this.approveOrderForm.get('orderStatus')?.value;

    if (orderID && orderStatus) {
      this.orderService.approveOrder(orderID, orderStatus).subscribe(
        (response) => {
          console.log('Order approved:', response);
          this.fetchOrders(); // Refresh orders after approval
          this.CloseFormApprove(); // Close modal
        },
        (error) => {
          console.error('Error approving order:', error);
        }
      );
    }
  }

  // Check if an order is pending approval
  isPending(order: OrderRequest): boolean {
    return order.orderStatus === 'Pending';
  }

  // Show modal by ID
  showModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  // Close approve modal
  CloseFormApprove(): void {
    this.selectedOrder = null; // Reset selected order
    this.hideModal('approveOrderModal'); // Hide modal
  }

  // Open order detail modal
  openOrderDetailModal(order: OrderRequest): void {
    this.selectedOrder = order;

    // Ensure orderDetails exists to avoid errors
    if (!this.selectedOrder.orderDetails) {
      this.selectedOrder.orderDetails = [];
    }

    this.showModal('orderDetailModal'); // Show order detail modal
  }

  // Close order detail modal
  CloseFormDetail(): void {
    this.selectedOrder = null; // Reset selected order
    this.hideModal('orderDetailModal'); // Hide modal
  }

  // Hide modal by ID
  hideModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

