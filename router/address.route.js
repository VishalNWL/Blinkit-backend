import {Router} from "express"
import { addAddressController, deleteAddressController, getAddressController, updateAddressController } from "../controller/address.controller.js"
import auth from "../middleware/auth.middleware.js"

const addressRouter = Router()

addressRouter.post('/create',auth,addAddressController)
addressRouter.get('/get',auth,getAddressController)
addressRouter.put('/update',auth,updateAddressController)
addressRouter.post('/disable',auth,deleteAddressController)

export default addressRouter