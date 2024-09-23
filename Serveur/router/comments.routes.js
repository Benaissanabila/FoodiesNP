
import express from 'express';
const router = express.Router();

import * as controller from "../controllers/comments.controller.js"



router.post('/', controller.createComment);
router.get('/', controller.getAllComments);
router.get('/:id', controller.getComment);


export default router;