import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  CheckoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";
import { stripe } from "../lib/stripe.js";

const router = express.Router();

//this one is really prone to error
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, CheckoutSuccess);
export default router;
