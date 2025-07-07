import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/ImageRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('API working');
});
app.use('/api/user', userRouter);
app.use('/api/image',imageRouter);


// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
