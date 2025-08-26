import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from 'express';
import connectDB from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json()); //to parse json data(req.body)
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data
app.use(cookieParser()); //for protect-route we need this middleware here.


app.use("/api/auth", authRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})