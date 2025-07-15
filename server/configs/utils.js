import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        {
            clerkId: user.clerkId,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

export default generateToken;
