import { ApiError } from "../utils/Apierrors.js"
import { Apiresponse } from "../utils/Apiresponse.js";
import uploadImageCloudinary from "../utils/Cloudinary.js";

const uploadImageController = async(req,res)=>{
    try {
        const file = req.file
                const imageurl = await uploadImageCloudinary(file);

        if(!imageurl){
            
            res.status(500).json(500,"Not Uploaded")
        }


        res.status(200).json(new Apiresponse(200,imageurl,"Image uploaded successfully"))
    } catch (error) {
        throw new ApiError(500,"Something went wrong")
    }
}

export default uploadImageController