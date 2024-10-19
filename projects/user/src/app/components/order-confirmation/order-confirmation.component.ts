import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../service/order.service'; 
import { OrderRequest } from '../../models/OrderRequest'; 
import { CartService } from '../../service/cart.service';  
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';


@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrderConfirmationComponent implements OnInit {
  orders: OrderRequest[] = [];
  totalAmount: number = 0;
  userID!: string ;
  hasOrders: boolean = false;
  cancelingOrderID: number | null = null;
  selectedOrder?: OrderRequest;
  cancelOrderForm!: FormGroup;

  orderItem: any[] = [];

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
  ) {
    // Initialize the cancellation form
    this.cancelOrderForm = this.fb.group({
      cancellationReason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userID = this.cartService.getUserID();
    if (userID) {
      this.userID = userID;
      // Fetch orders for the user
      this.fetchOrders();
      // this.orderService.getAllOrders(this.userID).subscribe(
      //   (data) => {
      //     console.log('Fetched order data:', data);
      //     this.orderItem = data;
      //   })

    } else {
      console.error('UserID is null or undefined');
      this.router.navigate(['/login']);
    }
  }

  showCancelOrderModal(order: OrderRequest): void {
    this.selectedOrder = order;
  }

  closeCancelOrderForm(): void {
    this.selectedOrder = undefined;
  }

  fetchOrders(): void {
    this.orderService.getAllOrders(this.userID).subscribe(
      (data: any) => {
        console.log('Fetched order data:', data);
  
        if (Array.isArray(data) && data.length > 0) {
          this.orders = data.map((item: any) => {
            if (item.hasOwnProperty('ordermodels') && item.hasOwnProperty('orderDetails')) {
              const ordermodels = item.ordermodels;
              const orderDetails = item.orderDetails;
  
              return ordermodels.map((order: any) => {
                // Fetch product names for each order detail
                order.orderDetails = orderDetails.filter((detail: any) => detail.orderID === order.orderID);
                order.orderDetails.forEach((detail: any) => {
                  this.productService.getProductById(detail.productID).subscribe(product => {
                    detail.productName = product ? product.productName : 'Không tìm thấy sản phẩm'; // Assign product name
                  });
                });
                return order;
              });
            }
            return [];
          }).flat();
  
          console.log("Order Information:", this.orders);
          this.totalAmount = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
          this.hasOrders = this.orders.length > 0;
        } else {
          console.error('Data is not an array or is empty:', data);
          this.hasOrders = false;
        }
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.hasOrders = false;
      }
    );
  }
  
  // Cancel an order
  onConfirmCancelOrder(): void {
    if (this.cancelOrderForm.valid && this.selectedOrder) {
      const cancellationReason = this.cancelOrderForm.get('cancellationReason')?.value;

      this.orderService.cancelOrder(this.selectedOrder.orderID, cancellationReason).subscribe(
        (response) => {
          console.log('Order successfully canceled:', response);
           this.fetchOrders();
          this.closeCancelOrderForm();
        },
        (error) => {
          console.error('Error canceling order:', error);
        }
      );
    }
  }

  // Check if an order can be canceled based on its status
  isOrderCancelable(order: OrderRequest): boolean {
    return order.orderStatus === 'Pending';
  }

  // Check if an order is new (placed within the last 7 days)
  isNewOrder(order: OrderRequest): boolean {
    const currentDate = new Date();
    const orderDate = new Date(order.orderDate);
    const daysDifference = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
    return daysDifference <= 7;
  }
}
