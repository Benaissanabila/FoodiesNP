import express from 'express';
const router = express.Router();

import * as controller from "../controllers/users.controller.js"



router.post('/', controller.createUser);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);  
router.delete('/:id', controller.deleteUser);
router.post('/login', controller.loginUser);
router.post('/:id/photo', controller.updateProfilePhoto);

export default router;
