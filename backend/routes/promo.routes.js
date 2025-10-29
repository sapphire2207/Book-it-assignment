import express from "express";
import { validatePromo } from "../controllers/promo.controller.js";
const router = express.Router();

router.post("/validate", validatePromo);

export default router;