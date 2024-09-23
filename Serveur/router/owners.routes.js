import express from 'express';
const router = express.Router();

import * as controller from "../controllers/owners.controller.js"



router.post('/', controller.createOwner);
router.get('/', controller.getAllOwners);
router.get('/:id', controller.getOwner);
router.put('/:id', controller.updateOwner);
router.delete('/:id', controller.deleteOwner);


export default router;