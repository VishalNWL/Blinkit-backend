import { Router } from "express";
import auth from '../middleware/auth.middleware.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from "../controller/product.controller.js";
import { admin } from "../middleware/Admin.js";


const productRouter = Router()

productRouter.post('/create',auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post('/get-product-by-category',getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)

//Update Product

productRouter.put('/update-product-details',auth,admin,updateProductDetails)
//Delete Product
productRouter.post('/delete-product',auth,admin,deleteProductDetails)

//search product  api

productRouter.post('/search-product',searchProduct)

export default productRouter