import express from 'express';
const router = express.Router();

import * as controller from "../controllers/reservations.controller.js"



router.post('/', controller.createReservation);
router.get('/', controller.getAllReservations);
router.get('/:id', controller.getReservation);
router.put('/:id', controller.updateReservation);
router.delete('/:id', controller.deleteReservation);
router.get('/user/:userId',controller.getUserReservations);
export default router;