import userModel from "../models/userModel.js"
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js"
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import generateToken from '../configs/utils.js'

dotenv.config()

// API controller function to get user available credits data 
const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.user

        const userData = await userModel.findOne({ clerkId })
        res.json({ success: true, credits: userData.creditBalance });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Gateway initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to make payment to credits
const paymentRazorpay = async (req, res) => {
    try {
        const { clerkId } = req.user;
        const { planId } = req.body;
        const user = await userModel.findOne({ clerkId });

        if (!user || !planId) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        let credits, plan, amount, date;
        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100;
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500;
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000;
                amount = 250
                break;

            default:
                break;
        }

        date = Date.now()

        const transactionData = {
            clerkId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// API controller function to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === "paid") {
            const transactionData = await transactionModel.findById(orderInfo.receipt);

            if (transactionData.payment) {
                return res.json({ success: false, message: "Payment Failed" });
            }
            const userData = await userModel.findOne({ clerkId: transactionData.clerkId });

            const creditBalance = userData.creditBalance + transactionData.credits;

            await userModel.findByIdAndUpdate(userData._id, { creditBalance });

            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({ success: true, message: "Credits added" })
        }
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ✅ auto adjusts
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // ✅ dev vs prod
            path: '/',
        });


        return res.json({
            success: true,
            message: "Logged in",
            token,
            user: {
                clerkId: user.clerkId,
                firstName: user.firstName,
                photo: user.photo,
            },
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
        return res.json({ success: false, message: "Please fill all required fields" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            clerkId: uuidv4(),
            photo: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
        });

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ✅ auto adjusts
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // ✅ dev vs prod
            path: '/',
        });


        res.json({
            success: true,
            message: 'Signup successful',
            token,
            user: {
                clerkId: user.clerkId,
                firstName: user.firstName,
                photo: user.photo,
                email: user.email,
            },
        });


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

const getLoggedInUser = async (req, res) => {
    try {
        console.log(req.user)
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const user = await userModel.findOne({ clerkId: req.user.clerkId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                firstName: user.firstName,
                email: user.email,
                photo: user.photo || null,
                clerkId: user.clerkId,
            },
        });
    } catch (error) {
        console.error("Error in /me:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export { userCredits, paymentRazorpay, verifyRazorpay, signup, login, getLoggedInUser };
