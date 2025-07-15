import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/ImageRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cors({ credentials: true, origin: "https://free-bg-removal.vercel.app", optionsSuccessStatus: 200 }));
app.use(cookieParser());


connectDB();


app.get('/', (req, res) => {
    res.send('API working');
});
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
