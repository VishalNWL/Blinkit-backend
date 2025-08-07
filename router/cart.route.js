import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controller/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get('/get',auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.post('/delete-cart-item',auth,deleteCartItemQtyController)
export default cartRouter