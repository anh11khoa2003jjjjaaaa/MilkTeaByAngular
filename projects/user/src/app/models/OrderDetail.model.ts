// order-detail.model.ts
export interface OrderDetail {
    productName: string;
    quantity: number;
    price: number;
  }
  
  export interface OrderDetailsResponse {
    orderDetails: OrderDetail[];
    totalAmount: number;
  }
  