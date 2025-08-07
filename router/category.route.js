import {Router} from 'express'
import auth from '../middleware/auth.middleware.js'
import { AddCategoryController , deleteCategoryController, getCategoryController, updateCategoryController} from '../controller/category.controller.js';


const categoryRouter = Router();


categoryRouter.post('/add-category',auth,AddCategoryController)
categoryRouter.get("/get",getCategoryController)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.post('/delete',auth,deleteCategoryController)

export default categoryRouter