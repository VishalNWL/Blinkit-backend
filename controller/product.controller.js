import { Apiresponse } from '../utils/Apiresponse.js'
import ProductModel from '../models/product.model.js'


export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish } = req.body;

    if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !stock || !price || !description) {
      return res.status(400).json(new Apiresponse(400, "All fields required"))
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish
    })

    const saveProduct = await product.save();

    return res.status(200).json(new Apiresponse(200, saveProduct, "Product uploaded successfully"))

  } catch (error) {
    return res.status(500).json(new Apiresponse(500, error.message || error))
  }
}


export const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

const query = search
  ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        // Add more fields if needed
      ]
    }
  : {};

    console.log(query)

    const skip = (page - 1) * limit

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
      ProductModel.countDocuments(query)
    ])

    return res.status(200).json(new Apiresponse(200, { totalCount, totalPage: Math.ceil(totalCount / limit), data }, "Product fetched successfully"))

  } catch (error) {
    console.log("getProductController", error)
    return res.status(500).json(new Apiresponse(500, {}, "Something went wrong"))
  }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory= async(req,res)=>{
  try {
      const {id}= req.body;

      if(!id){
       return res.status(400).json(new Apiresponse(400,{},"Provide category id"))
      }

      const product = await ProductModel.find({
        category:{$in:[id]}
      }).limit(15)

      return res.status(200).json(new Apiresponse(200,product,"Product fetched successfully"))
     
  } catch (error) {
     return res.status(500).json(new Apiresponse(500,{error},"Something went wrong"))
  }
}

export const getProductByCategoryAndSubCategory=async(req,res)=>{
  try {

    let {categoryId,subCategoryId,page,limit}=req.body;
    console.log(categoryId,subCategoryId)

    if(!categoryId || !subCategoryId){
      return response.status(400).json(400,{},"All fields required")
    }

    if(!page){
      page=1
    } 

    if(!limit){
      limit=10
    }

 const query = {};

query.category = { $in: [categoryId] }
query.subCategory = { $in: [subCategoryId] }


    
    const skip=(page-1)*limit
    const [data,dataCount]=await Promise.all([
      ProductModel.find(query).sort({createdAt:-1}).skip(skip).limit(limit),
      ProductModel.countDocuments(query)
    ])
    
    return res.status(200).json(new Apiresponse(200,{data,dataCount,limit,page},"Product Fetched Successfully"))
    
  } catch (error) {
    return res.status(500).json(new Apiresponse(500,{},error.message||error))
  }
}

export const getProductDetails= async(req,res)=>{
  try {
    const {productId}= req.body;
    const product = await ProductModel.findOne({_id:productId})

    return res.status(200).json(new Apiresponse(200,product,"Product fetched successfully"))
    
  } catch (error) {
    return res.status(500).json(new Apiresponse(500,{},error.message||error))
  }
}

//search product

export const searchProduct=async(req,res)=>{
   try {

      let {search,page,limit}=req.body;

      if(!page){
        page=1;
      }
      if(!limit){
        limit=10;
      }

      const query = search?{
            $text:{
              $search:search
            }
      }:{}

      const skip = (page-1)*limit

      const [data,dataCount]= await Promise.all([
          ProductModel.find(query).sort({createdAt:-1}).skip(skip).limit(limit).populate('category subCategory'),
          ProductModel.countDocuments(query)
      ])
    
      return res.status(200).json({
        message:"Product data",
        error:false,
        success:true,
        data:data,
        totalCount:dataCount,
        totalPage:Math.ceil(dataCount/limit),
        page:page,
        limit:limit
      })
   } catch (error) {
     console.log(error)
      return res.status(500)
            .json(new Apiresponse(500,{},"Something went wrong"))
   }
}