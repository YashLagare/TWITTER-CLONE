import { v2 } from 'cloudinary';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from 'express';

//database here..
import connectDB from './db/connectDB.js';

//routes here..
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json()); //to parse json data(req.body)
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data
app.use(cookieParser()); //for protect-route we need this middleware here.


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})