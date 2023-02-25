import express from 'express';
import userController from './../Controllers/userController.js';

const router = express.Router();

router.post('/', userController.post);


export default router;
