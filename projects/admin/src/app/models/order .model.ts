export interface Order {
    orderID: number;
    userID: string;
    orderDate: string; // Use string to handle dates in JSON format
    totalAmount: number;
    orderStatus: string;
    cancellationReason: string;
}