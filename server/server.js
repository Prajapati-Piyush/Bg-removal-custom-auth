import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // ✅ fix here

// Database connection
connectDB(); // ✅ removed await

// Routes
app.get('/', (req, res) => {
  res.send('API working');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
