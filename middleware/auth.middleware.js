import { ApiError } from "../utils/Apierrors.js"
import jwt from "jsonwebtoken"

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.accessToken || req.headers?.authorization?.split(' ')[1];

         if(!token){
            throw new ApiError(400,"token required");
         }

         const decode = jwt.verify(token , process.env.SECRET_ACCESS_KEY);
         
         if(!decode){
            throw new ApiError(400,"Unauthorized request");
         }

         req.userId = decode._id;
         next();

    } catch (error) {
        throw new ApiError(500,"You have not Login"+error.message);
    }
}

export default auth;