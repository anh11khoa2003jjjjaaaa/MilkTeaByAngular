import { BigDecimal } from "bigdecimal.js";

export interface Recipi {
    recipeID: number; // Sử dụng number cho Long
    productID: string;
    ingredientID: number; // Sử dụng number cho Long
    quantity: BigDecimal; // Điều chỉnh loại dữ liệu nếu cần
}