import express from 'express';
import { uploadProfileImage } from '../controllers/uploadController.js';
import verifyToken, { authorize, ROLES } from '../middlewares/authmiddleware.js';
const router = express.Router();

router.post('/upload-profile', verifyToken, authorize(ROLES.STUDENT), uploadProfileImage );

export default router;
