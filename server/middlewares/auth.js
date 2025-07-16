import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  try {
    // Try from cookies first, then from headers
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: token missing',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach verified user info to request object
    req.user = {
      clerkId: decoded.clerkId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired',
    });
  }
};

export default authUser;




// import jwt from 'jsonwebtoken';
// import { User } from "../models/user.model.js";

// export const authUser = async (req, res, next) => {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//         return res.status(401).json({ message: "Authentication required" });
//     }

//     try {
//         // Decode the token to check expiration date
//         const decoded = jwt.decode(token);
//         if (decoded && decoded.exp < Date.now() / 1000) {
//             return res.status(401).json({ message: "Token expired" });
//         }

//         // Verify the token using the secret key
//         const verified = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(verified._id).select('-password');
        
//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }
        
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Token verification error:', error.message);
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };

