import express from "express"
import User from "./model/user.model.js";
import passport from 'passport'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { Strategy as LocalStrategy } from 'passport-local';
import multer from 'multer'
import verifyToken from "./middlewares/auth.js";
import { uploadfile } from "./controller/fileUpload.controller.js";
import connectDB from './db/index.js';
import userRouter from './routes/user.route.js';
import ErrorHandler, { ApiError } from "./utils/apiError.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use __dirname as usual



const app = express()
app.use(express.static(path.resolve(__dirname, 'dist')));
// express.static(path.resolve(__dirname, 'dist'))

app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use('/api/v1/users', userRouter)

const upload = multer({ storage: multer.diskStorage({}) })

// database 
connectDB()

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error.message);
    }
}));


//registeration

app.get('/', (req, res) => {
    res.send("good")
})
app.get('/volume',async (req,res)=>{
    try {
        const user = await User.find({})
        res.json({user})
    } catch (err){
        res.json({message:err.message})
    }
})
// upload router
app.post('/upload', verifyToken, upload.single('pdfFile'), uploadfile);

app.get('/profile',async (req, res, next) => {
    try {
        const user = await User.findOne({email:req.headers['email']})
        if (!user) {
            return next(new ErrorHandler(404, "user not found"))
        }
        else {
            res.status(200).json({user})
        }
    } catch (error) {
        next(error)
    }
})

app.use(ApiError)


export default app