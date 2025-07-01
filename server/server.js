import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import connectDB from './configs/db.js';
dotenv.config()


// Appp Config
const PORT = process.env.PORT || 3000;
const app = express()
await connectDB()

// Middleware
app.use(express.json())
app.use(cors)


// Routing
app.get('/', (req, res) => {
    res.send('API working')
})


app.listen(PORT, () => console.log("Server running on port", PORT))