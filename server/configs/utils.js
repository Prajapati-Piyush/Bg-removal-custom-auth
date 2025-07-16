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

// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

// const COOKIE_OPTIONS = {
//     httpOnly: true,  // Cookie will not be accessible via JavaScript
//     secure: process.env.NODE_ENV === "production",    // Set to true in production with HTTPS
//     sameSite: 'strict',  // Ensures cookie is only sent in first-party context
//     maxAge: 30 * 24 * 60 * 60 * 1000,  // 1 week
// };

// export const setAuthToken = (user, res) => {
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

//     res.cookie('auth_token', token, COOKIE_OPTIONS);

//     // Send the token along with the user data in the response body
//     return res.json({
//         success: true,
//         message: 'Logged in successfully',
//         user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             avatar: user.avatar,
//         },
//         token: token,  // Send the token in the response body
//     });
// };
