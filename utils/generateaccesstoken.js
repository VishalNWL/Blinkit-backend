import jwt from "jsonwebtoken"

const generateaccesstoken = async(userId)=>{
   const token = await jwt.sign(
    {
        _id:userId
    },
    process.env.SECRET_ACCESS_KEY,
    {expiresIn:'5h'}
   )

   return token;
}

export default generateaccesstoken;