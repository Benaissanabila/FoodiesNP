import express from 'express';
const router = express.Router();

import * as controller from "../controllers/plans.controller.js"



router.post('/', controller.createPlan);
router.get('/', controller.getPlans);
router.get('/:id', controller.getPlan);
router.put('/:id', controller.updatePlan);
router.delete('/:id', controller.deletePlan);

export default router;
