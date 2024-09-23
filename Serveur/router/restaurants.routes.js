import express from 'express';
const router = express.Router();

import * as controller from "../controllers/restaurants.controller.js"



router.post('/', controller.createRestaurant);
router.get('/', controller.getAllRestaurants);
router.get('/:id', controller.getRestaurant);
router.put('/:id', controller.updateRestaurant);
router.delete('/:id', controller.deleteRestaurant);

export default router;