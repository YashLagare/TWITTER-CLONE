import express from 'express';
import { commentOnPost, createPost, deletePost, getAllPost, getLikedPosts, likeOrDislikePost } from '../controllers/postController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/all", protectRoute, getAllPost)
router.get("/likes/:id", protectRoute, getLikedPosts)
router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeOrDislikePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.delete("/:id", protectRoute, deletePost)


export default router;
