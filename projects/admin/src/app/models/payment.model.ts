export interface Payment {
    paymentID: number;
    orderID: number;
    paymentMethodID: number;
    paymentDate: Date;  // Use Date type for LocalDateTime
    amount: number;
    paymentUrl?: string;
}