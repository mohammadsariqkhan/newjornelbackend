import User from "../model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ErrorHandler from "../utils/apiError.js";


const jwtkey = process.env.JWT_SECRET

export const EditorLogin = async (req, res) => {
    try {
        const responese = await User.find({ role: 'author' })
        res.json(responese)
    } catch (err) {
        res.json({ message: err.message })
    }
}

export const RegisterUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return next(new ErrorHandler(400, "please enter a valid details"))
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new User({ username, email, role, password: hashedPassword })
            // const doc = user.save();
            jwt.sign({ user }, jwtkey, (err, token) => {
                user.token = token
                user.save()
                res.json({
                    user,
                    token
                })
            })
        }

    } catch (err) {
        next(err)
    }
}

export const Login = (req, res) => {
    // If authentication succeeds, return user details
    jwt.sign({ user: req.user }, jwtkey, (err, token) => {
        res.json({
            user: req.user,
            token
        })
    })
};
