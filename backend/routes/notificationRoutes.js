import express from 'express';
import { deleteNotification, deleteNotifications, getNotifications } from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications);
router.delete('/:id', protectRoute, deleteNotification);

export default router;
