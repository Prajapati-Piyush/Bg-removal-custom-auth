import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    console.log(token)

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized', token: token });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach to req.user instead of req.body
    req.user = {
      clerkId: decoded.clerkId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authUser;
