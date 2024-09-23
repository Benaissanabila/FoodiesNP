
import express from 'express';
const router = express.Router();

import * as controller from "../controllers/comments.controller.js"



router.post('/', controller.createComment);
router.get('/', controller.getAllComments);
router.get('/:id', controller.getComment);
router.put('/:id', controller.updateComment);
router.delete('/:id', controller.deleteComment);



export default router;