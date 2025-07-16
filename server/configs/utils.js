import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      clerkId: user.clerkId,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // optional: you can reduce to 1d for more security
  );
};

export default generateToken;
