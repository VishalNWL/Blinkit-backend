import { response } from 'express'
import CartProductModel from '../models/cartproduct.model.js'
import UserModel from '../models/user.model.js'
import successAlert from '../../frontend/src/Utils/SuccessAlert.js'


export const addToCartItemController = async(req,res)=>{
    try {

        const userId = req.userId
        const {productId}=req.body

        if(!productId){
            return response.status(400).json({
                message:"Provide productId",
                error:true,
                success:false
            })
        }

        const checkItemInCart = await CartProductModel.findOne({
            userId:userId,
            productId:productId
        })

        if(checkItemInCart){
              return res.status(400).json({
                 message:"Item already in cart"
              })
        }

        const cartItem= new CartProductModel({
            quantity:1,
            userId:userId,
            productId:productId
        })

        const save = await cartItem.save()

        const updateCartUser= await UserModel.updateOne({_id:userId},{
            $push:{
                shopping_cart:productId
            }
        })

        return res.status(200)
        .json({
            data:save,
            message:"Item added successfully",
            error:false,
            success:true
        })
        
    } catch (error) {
         return res.status(500).json(
            {
                message:error.message||error,
                error:true,
                success:false
            }
         )
    }
}

export const getCartItemController= async(req,res)=>{
    try {
        
        const userId = req.userId

        const cartItem = await CartProductModel.find({
            userId:userId
        }).populate('productId')

        return res.status(200).json({
            data:cartItem,
            success:true,
            error:false
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            success:false,
            error:true
        })
    }
}

export const updateCartItemQtyController= async(req,res)=>{
    try {
        const userId = req.userId
        const {_id,qty}=req.body

        if(!_id || !qty){
            return res.status(400).json({
                message:"Provide _id,qty"
            })
        }

        const updateCartItem = await CartProductModel.updateOne({
            _id:_id,
            userId:userId
        },{
            quantity:qty
        })

        return res.status(200).json({
            message:"Cart Updated",
            success:true,
            error:false,
            data:updateCartItem
        })
        
    } catch (error) {
         return response.status(500).json({
            message:error.message||error,
            error:true,
            success:false
         })
    }
}

export const deleteCartItemQtyController=async(req,res)=>{
    try {
        const userId= req.userId;
        const {_id }= req.body;

        if(!_id){
            return res.status(400).json({
                message:"Provide product id",
                error:true,
                success:false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({_id:_id,userId:userId})

        return res.status(200).json({
            message:"Item removed",
            error:false,
            success:true,
            data:deleteCartItem
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}