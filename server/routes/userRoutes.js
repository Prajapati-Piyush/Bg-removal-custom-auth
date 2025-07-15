import express from 'express';
import {
  paymentRazorpay,
  userCredits,
  verifyRazorpay,
  login,
  signup,
  getLoggedInUser
} from '../controllers/UserController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();


userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/me', authUser, getLoggedInUser);


userRouter.get('/credits', authUser, userCredits);
userRouter.post('/pay-razor', authUser, paymentRazorpay);
userRouter.post('/verify-razor', verifyRazorpay);

export default userRouter;
