import express from 'express';
const router = express.Router();

import * as controller from "../controllers/users.controller.js"

import {verifyRole,verifyToken} from "../controllers/users.controller.js"

router.post('/', controller.createUser);
router.post('/admin', controller.createAdminUser);
router.get('/', controller.getUsers);
router.get('/admin', verifyToken, verifyRole('admin'), controller.getUsers); 
router.get('/:id', controller.getUser);
router.get('/email/:email', controller.getUserByEmail);
router.put('/:id', controller.updateUser);  
router.delete('/:id', controller.deleteUser);
router.post('/login', controller.loginUser);
router.post('/:id/photo', controller.updateProfilePhoto);
router.post('/verify2fa', controller.verify2FA);
router.post('/refresh-token', controller.refreshToken)

export default router;
