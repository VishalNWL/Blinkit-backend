import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js";

const generaterefreshtoken = async(userId)=>{
    const token = await jwt.sign({id:userId},

        process.env.SECRET_REFRESH_KEY,
        {
            expiresIn:'7d'
        }
    )

    const updaterefreshtoken = await UserModel.updateOne({
        _id:userId},{ refresh_token:token}
    )
    
    return token;
}

export default generaterefreshtoken