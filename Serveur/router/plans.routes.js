import express from 'express';
const router = express.Router();

import * as controller from "../controllers/plans.controller.js"
import {verifyRole,verifyToken} from "../controllers/users.controller.js"


router.post('/admin', verifyToken, verifyRole('admin'), controller.createPlan);
router.get('/', controller.getPlans);
router.get('/:id', controller.getPlan);
router.put('/:id', controller.updatePlan);
router.delete('/:id/admin',verifyToken, verifyRole('admin'), controller.deletePlan);

export default router;
