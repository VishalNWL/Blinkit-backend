import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})


const uploadImageCloudinary = async (image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

  return new Promise((resolve) => {
    cloudinary.uploader.upload_stream((error, uploadResult) => {
        return resolve(uploadResult);
    }).end(buffer);
}).then((uploadResult) => {
    return uploadResult.secure_url ;
});

}

export default  uploadImageCloudinary;
