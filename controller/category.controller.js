import { ApiError } from '../utils/Apierrors.js';
import {Apiresponse} from '../utils/Apiresponse.js'
import CategoryModel from '../models/category.model.js'
import SubCategoryModel from '../models/subCategory.model.js'
import ProductModel from '../models/product.model.js'
const AddCategoryController = async (req,res)=>{
    try {
        const {name, image} = req.body;

        if(!name || !image){
            res.status(400).json(new Apiresponse(400,"All fields required"))
        }


      const addCategory = new CategoryModel({
        name,
        image
      })
      
      const saveCategory = await addCategory.save();

       if(!saveCategory){
          res.status(500).json(500,"Not Uploaded")
       }
      res.status(200).json(new Apiresponse(200,saveCategory,"Category added Successfully"))

    } catch (error) {
        throw new ApiError(500,"Something went wrong"+ error)
    }
}

const getCategoryController = async(req,res)=>{
    try {
        const data = await CategoryModel.find().sort({createdAt:-1});

        res.status(200).json(new Apiresponse(200,data,"Category fetched successfully"))
    } catch (error) {
        throw new ApiError(500,"Something went wrong")
    }
}


const updateCategoryController = async (req,res)=>{
    try {

        const {categoryId,name,image} = req.body;
        const update = await CategoryModel.updateOne({
            _id:categoryId
        },{
            name,
            image
        })

        res.status(200).json(new Apiresponse(200,update,"Category updated successfully"))
        
    } catch (error) {
        throw new ApiError(500,"Something went wrong");
    }
}

const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json(new Apiresponse(400, null, "Category ID is required"));
        }

        const checkSubCategory = await SubCategoryModel.countDocuments({
            category: { "$in": [_id] }
        });

        const checkProduct = await ProductModel.countDocuments({
            category: { "$in": [_id] }
        });

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json(new Apiresponse(400, null, "Category already in use. Can't delete"));
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id });

        if (deleteCategory.deletedCount === 0) {
            return res.status(404).json(new Apiresponse(404, null, "Category not found"));
        }

        return res.status(200).json(new Apiresponse(200, deleteCategory, "Deleted Successfully"));

    } catch (error) {
        console.error("Delete error:", error);
        throw new ApiError(500, "Something went wrong: " + error.message);
    }
}


export {
    AddCategoryController,
    getCategoryController,
    updateCategoryController,
    deleteCategoryController
}