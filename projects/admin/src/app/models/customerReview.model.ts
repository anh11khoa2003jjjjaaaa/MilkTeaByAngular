export interface CustomerReview {
    reviewID: number;
    userID: string;
    productID: string;
    rating: number;
    comment: string;
    reviewDate: Date;
}