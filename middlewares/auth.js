import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
const jwtkey = process.env.JWT_SECRET

// Assuming token is sent in the request headers as "Authorization: Bearer <token>"
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Extract the token from the "Bearer <token>" format
    const tokenParts = token.split(' ');
    const tokenValue = tokenParts[1];

    jwt.verify(tokenValue, jwtkey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }// Attach the decoded payload to the request object for further processing
        req.user = decoded
        next();
    });
};

export default verifyToken