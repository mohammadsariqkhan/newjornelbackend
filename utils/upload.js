import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME ,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

// Upload a PDF file
export const uploadFile = async (filePath,fileName) => {
    try{
        const filename = fileName.split('.')
        const fileFullName = filename[0]
      const result = await cloudinary.uploader.upload(filePath,{
          resource_type: 'raw',
          public_id:`${fileFullName}`
      })
        return result
    } catch (err){
        console.log(err.log)
    }
}


