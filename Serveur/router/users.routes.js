import express from 'express';
const router = express.Router();

import * as controller from "../controllers/users.controller.js"



router.post('/', controller.createUser);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);


export default router;
