import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import { connectDB } from './config/database.js'
import userroute from './router/user.route.js'
import categoryRouter from './router/category.route.js'
import uploadRouter from './router/upload.route.js'
import subCategoryRouter from './router/subCategory.route.js'
import productRouter from './router/product.route.js'
import cartRouter from './router/cart.route.js'
import addressRouter from './router/address.route.js'
import orderRouter from './router/order.route.js'

dotenv.config({
    path:'./.env'
})

const app= express();


app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy:false
}))

const port = 5000||process.env.PORT;

app.get('/',(req,res)=>{
    res.json({
        message:"Hello"
    })
})

app.use('/api/user',userroute)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter) 
app.use('/api/order',orderRouter)
app.get('/favicon.ico', (req, res) => res.status(204).end());

connectDB().then(()=>{
    app.listen(port,()=>{
    console.log("server is running on port "+port)
})
})  




//this is global middleware for error handling
// app.use((err, req, res, next) => {
//   if (err instanceof ApiError) {
//     return res.status(err.statusCode).json({
//       success: false,
//       message: err.message,
//       errors: err.errors || [],
//       stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//     errors: [],
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// });
