import SubCategoryModel from "../models/subCategory.model.js";
import { ApiError } from "../utils/Apierrors.js";
import { Apiresponse } from "../utils/Apiresponse.js";


export const AddSubCategoryController=async(req,res)=>{
    try {
        const {name,image,category}=req.body;

        if(!name ||!image || !category[0]){
            res.status(400).json(new Apiresponse(400,"All field required"))

        }

        const payload ={
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        res.status(200).json(new Apiresponse(200,save,"Sub category created"))
    } catch (error) {
        throw new ApiError(500,"Something went wrong "+error)
    }    
}

export const getSubCategoryController = async(req,res)=>{
    try {
        const data = await SubCategoryModel.find().sort({createdAt:-1}).populate("category")
        res.status(200).json(new Apiresponse(200,data,"Sub category data"))
        
    } catch (error) {
        res.status(500).json(new Apiresponse(500,error,"Something went wrong"))
    }
}


export const updateSubCategoryController = async(req,res)=>{
    try {

        const {_id , name,category,image} = req.body;
        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            res.status(400).json(new Apiresponse(400,"Check you _id"))
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        res.status(200).json(new Apiresponse(200,updateSubCategory,"Category updated successfully"))
        
    } catch (error) {
        console.log(error);
        res.status(500).json(new Apiresponse(500,error,"Something went wrong"))
    }
}


export const deleteSubCategoryController = async(req,res)=>{
    try {
        const {_id}=req.body;

        const deleteSub = await SubCategoryModel.findByIdAndDelete({_id})

        res.status(200).json(new Apiresponse(200,deleteSub,"Deleted Successfully"));

    } catch (error) {
        res.status(500).json(new Apiresponse(500,error,"Something went wrong"))
    }
}