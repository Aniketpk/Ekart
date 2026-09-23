import express from "express";
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalesData, getUserOrders, verfyPayment } from "../controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create-order",isAuthenticated, createOrder);
router.post("/verify-payment",isAuthenticated, verfyPayment);
router.get("/myorder",isAuthenticated, getMyOrder);
router.get("/all", isAuthenticated, isAdmin, getAllOrdersAdmin);
router.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrders);
router.get("/sales", isAuthenticated, isAdmin, getSalesData);




export default router;