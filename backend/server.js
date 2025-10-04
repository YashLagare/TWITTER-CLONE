import { v2 } from 'cloudinary';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from 'express';
import path from 'path';
import { fileURLToPath } from "url"; // ✅ Needed for __dirname in ES modules

//database here..
import connectDB from './db/connectDB.js';

//routes here..
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

//  Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
//also expanded the img limit but remember dont make limit too large it causes DOS attacks
app.use(express.json({ limit: "50mb" })); //to parse json data(req.body)
app.use(express.urlencoded({ extended: true })); //to parse urlencoded data
app.use(cookieParser()); //for protect-route we need this middleware here.

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
