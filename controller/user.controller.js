import User from '../models/user.model.js'
import sendEmail from '../config/sendEmail.js'
import bcryptjs from 'bcrypt'
import verifyEmailTemplate from '../utils/verifyEmail.js'
import UserModel from '../models/user.model.js'
import {Apiresponse} from '../utils/Apiresponse.js'
import { ApiError } from '../utils/Apierrors.js'
import generateotp from '../utils/generateotp.js'
import dotenv from 'dotenv'
import generateaccesstoken from '../utils/generateaccesstoken.js'
import generaterefreshtoken from '../utils/generaterefreshtoken.js'
import uploadImageCloudinary from '../utils/Cloudinary.js'
import { forgotPasswordTemplate } from '../utils/forgotPasswordTemplate.js'
import jwt from "jsonwebtoken"
dotenv.config({
    path:'./.env'
})
 
export async function registerUserController(request,response){
    try {
        const { name, email , password } = request.body

        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide email, name, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(user){
            return response.json({
                message : "User Already Registered",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)
        
        const role = (email==='vishalqbsj@gmail.com')?'ADMIN':'USER'

        const payload = {
            name,
            email,
            password : hashPassword,
            role
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from binkeyit",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })
        })

        return response.json({
            message : "User register successfully",
            error : false,
            success : true,
            data : save
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function verifyEmailController(request,response){
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code },{
            verify_email : true
        })

        return response.json({
            message : "Verify email done",
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : true
        })
    }
}

//login controller
export async function loginController(req,res){
    try {
      const {email,password} = req.body;

      if(!email && !password) {
       return res.status(400).json(new Apiresponse(400,{},"Email and password required"));
    }
    
    const user = await UserModel.findOne({email:email});
    
    if(!user){
         return res.status(400).json(new Apiresponse(400,{},"User not found"));
        
        }
        
        if(user.status!=='Active'){
          return res.status(400).json(new Apiresponse(400,{},"Contact to admin"));
    
        }
        
        const checkpassword = await bcryptjs.compare(password,user.password);
        
        if(!checkpassword){
         return res.status(400).json(new Apiresponse(400,{},"Wrong Password"));
    
      }

      const Accesstoken= await generateaccesstoken(user._id);
      const Refreshtoken = await generaterefreshtoken(user._id)

      const updateUser = await UserModel.findByIdAndUpdate(user._id,{last_login_date:new Date()})
      const options={
        httpOnly:true,
        secure:true,
        sameSite:"None"
      }
      res.cookie("accessToken",Accesstoken,options);
      res.cookie("refreshToken",Refreshtoken,options);

    return  res.status(200).json(new Apiresponse(200,{Refreshtoken,Accesstoken,user},"user logged in"))

    } catch (error) {
        throw new ApiError(500,"Something happen while login"+ error);
    }
}

//logout controller

export async function logoutController(req,res){
    try {
        const userid = req.userId;

        const options={
        httpOnly:true,
        secure:true,
        sameSite:"None"
      }
        res.clearCookie("accessToken",options);
        res.clearCookie("refreshToken",options);

         const user = await UserModel.findByIdAndUpdate({_id:userid}, { refresh_token:""});

        res.status(200).json(new Apiresponse(200,"Logout successful"));
        
    } catch (error) {
        throw new ApiError(500,"There is some error while logout");
    }
}

//upload user avatar

export async function uploadAvatar(req,res) {
    try {
        const userId = req.userId;
        const image = req.file;
        if(!image){
            throw new ApiError(400,"Image required");
        }
        const uploadurl =await uploadImageCloudinary(image);
        console.log(uploadurl)
        const updateuser = await UserModel.findByIdAndUpdate(userId,{
            avatar:uploadurl
        },{new:true,runValidators:true})

         return res.status(200).json(new Apiresponse(200,{avatar:uploadurl},"avatar uploaded successfully"))

    } catch (error) {
        throw new ApiError(500,"Error while uploading"+error.message)
    }
}


//update user

export async function updateuser(req,res){
    try {

       const userid=req.userId;
       const {name,email,mobile,password}=req.body;

         if(!userid){
            throw new ApiError("User not logged in");
         }

        let hashPassword = ""
         if(password){
            const salt = await bcryptjs.genSalt(10);
            hashPassword= await bcryptjs.hash(password,salt);
         }

         const updateduser= await UserModel.findByIdAndUpdate(userid,{
            ...(name&& {name:name}),
            ...(email&& {email:email}),
            ...(mobile&& {mobile:mobile}),
            ...(password&& {password:hashPassword})
         },{new:true , runValidators:true})
        
         res.status(200).json(new Apiresponse(200,updateduser,"Updated successfully"))
    } catch (error) {
        throw new ApiError(500,"Something went wrong while updating user" + error.message);
    }
}


//forget password
export async function  forgotPassword(req,res){
    try {
        
        const {email}=req.body;
        const user = await UserModel.findOne({email:email});
        if(!user){
            throw new ApiError(400,"User not found");
        }
       
        const otp = generateotp();

        const expireTime = new Date(Date.now() + 60*60*1000) // 1hr
        
        user.forgot_password_otp =otp;
        user.forgot_password_expiry=expireTime;
       await user.save();

       await sendEmail({
        sendTo:email,
        subject:"Forgot Password from Blinkit",
        html: forgotPasswordTemplate({name:user.name , otp:otp})
       })

       res.status(200).json(new Apiresponse(200,{},"Check you email for otp"));
    } catch (error) {
        
        throw new ApiError(500,"Something wend wrong " + error.message);
    }
}

//verify forgot password otp

export async function verifyForgotPasswordOtp(req,res) {
    try {
      const {email,otp}=req.body;
      if(!email || !otp){
        throw new ApiError(400,"Provide required field")
      }
      const user = await UserModel.findOne({email});
      if(!user){
        throw new ApiError(400,"user not found");
      }
      
    const currentTime = Date.now();

    if(user.forgot_password_expiry <currentTime){
        throw new ApiError(400,"OTP expired");
    }

    if(otp!==user.forgot_password_otp){
        throw new ApiError(400,"Otp not matched");
    }
    
    const updateUser = await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp:"",
        forgot_password_expiry:""
    })
    res.status(200).json(new Apiresponse(200,{},"Otp verified successfully"));


    } catch (error) {
        throw new ApiError(500,"Something went wrong "+error.message);
    }
}

//reset password

export async function resetpassword(req,res){
  try {
      
    const {email , newPassword , confirmPassword} = req.body;

    if(!email || !newPassword ||!confirmPassword){
        throw new ApiError(400,"All fields are required");
    }
    
    if(newPassword !==confirmPassword){
        throw new ApiError(400,"Forgot password and confirm password are not equal");
    }

    const user = await UserModel.findOne({email});
    if(!user){
        throw new ApiError(400,"User not found")
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(newPassword,salt);

    user.set('forgot_password_otp', undefined, { strict: false });
    user.set('forgot_password_expiry', undefined, { strict: false });
    user.set('password', hashedpassword, { strict: false });
    await user.save();

    res.status(200).json(new Apiresponse(200,user,"Password updated successfully"));
    
  } catch (error) {
    throw new ApiError(500,"Something went wrong "+error.message);
  }
}


//refresh token controller

export async function refreshToken(req,res){
    try {
        const refreshToken = req.cookies.refreshToken || req.headers?.authorization?.split(" ")[1] ///[Bearer token]

        if(!refreshToken){
            res.status(400).json(new Apiresponse(400,{},"Unauthorized access"));
        }

       const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_REFRESH_KEY)
       
       if(!verifyToken){
         res.status(400).json(new Apiresponse(400,{},"Token expired"));
       }

       const userId = verifyToken._id;

       const options={
        httpOnly:true,
        secure:true,
        sameSite:"None"
      }

       const newAccessToken = await generateaccesstoken(userId);
       const user = await UserModel.findById(userId);
       res.cookie('accessToken',newAccessToken,options)

       res.status(200).json(new Apiresponse(200,{accessToken:newAccessToken},"AccessToken generated Successfully"))

    } catch (error) {
        throw new ApiError(500,"Something went wrong "+error.message);
    }
}

//get Current User

export async function currentUser(req,res){
    try {
        const userId= req.userId
        const user = await UserModel.findById(userId).select('-password');

        return res.status(200).json(new Apiresponse(200,{user},"successfully fetched user data"))
    } catch (error) {
        
        throw new ApiError(500,"Something went wrong " + error);
    }
}