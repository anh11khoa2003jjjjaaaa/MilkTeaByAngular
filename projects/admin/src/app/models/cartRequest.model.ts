import { Cart } from "../../../../admin/src/app/models/cart.model";
import { CartDetail } from "../../../../admin/src/app/models/cartDetail.model";

export interface CartRequest{
cartmodel: Cart,
cartdetail: CartDetail

}