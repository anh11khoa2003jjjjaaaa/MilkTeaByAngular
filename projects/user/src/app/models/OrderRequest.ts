import { Product } from "../../../../admin/src/app/models/product.model";

export interface OrderRequest {

    orderID:number;
    userID: string;
    displayName?:string;
    totalAmount: number;
    cancellationReason: string;
    paymentMethodID: number;
    orderStatus:string;
    orderDate:Date;
 
    orderDetails: Array<{
      cartDetailID:number;
      productID: string;
      quantity: number;
      size: string;
      price: number;
      productName?: string;
    }>;
  }
  