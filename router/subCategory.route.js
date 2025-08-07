import {Router} from "express"
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controller/subCategory.controller.js"
import auth from "../middleware/auth.middleware.js"
const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)
subCategoryRouter.post('/get',getSubCategoryController)
subCategoryRouter.put('/update',auth,updateSubCategoryController)
subCategoryRouter.post('/delete',auth,deleteSubCategoryController);


export default subCategoryRouter

