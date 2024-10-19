export interface CartDetail {
    cartDetailID: number;
    cartID: number;
    productID: string;
    productName?:string;
    quantity: number;
    price: number;
    size: string;
    image: string;
    selected?: boolean;

}
