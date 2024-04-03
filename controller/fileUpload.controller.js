import {uploadFile} from "../utils/upload.js";
import User from "../model/user.model.js";
import nodemailer from "nodemailer";

export const uploadfile = async (req,res) => {
    try {
        const upload = await uploadFile(req.file.path,req.file.originalname)
        const url = upload.secure_url
        const email = req.headers['email']
        const filter = {email:email}
        const user = await User.updateMany(filter,{$push:{
                file_urlAndTitle:{
                    title:req.body.title,
                    urls:url
                }
            }})
        const mailer = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: "mohsariqkhan2004@gmail.com",
                pass: process.env.MAIL_PASS,
            },
        });
        const maildetail = {
            from:'mohsariqkhan2004@gmail.com',
            to:email,
            subject:'Mail for uploading file successfully',
            text:'Thank you for uploading your file on RJSC'
        }
        mailer.sendMail(maildetail,(err,result)=>{
            if(err){
                console.log(err.message)
            }
        })
        res.json({message:"success fully uploaded"})
    } catch (err){
        console.log(err.message)
    }
}