import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (user) => {
    return jwt.sign(
        {
            clerkId: user.clerkId,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export default generateToken;
