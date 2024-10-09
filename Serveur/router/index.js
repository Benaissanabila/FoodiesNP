import express from "express";
const router = express.Router();

//importer les routes
import usersRoutes from"./users.routes.js";
import commentsRoutes from"./comments.routes.js";
import restaurantsRoutes from"./restaurants.routes.js";
import ownersRoutes from"./owners.routes.js";
import plansRoutes from"./plans.routes.js";
import reservationRoutes  from "./reservations.routes.js";
import { verify2FA } from "../controllers/users.controller.js";

//ajouter les routes au router 
router.use("/users",usersRoutes);
router.use("/comments",commentsRoutes);
router.use("/restaurants",restaurantsRoutes);
router.use("/owners",ownersRoutes);
router.use("/plans",plansRoutes);
router.use("/reservations",reservationRoutes);
router.use("/login", usersRoutes);
router.use("/verify2FA", verify2FA);

export default router;
