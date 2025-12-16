import express from "express";
import CartRoutes from "./Cart.routes";
import CartItemRoutes from "./CartItem.routes";
import OrderRoutes from "./Order.routes";
import OrderItemRoutes from "./OrderItem.routes";
import PaymentRoutes from "./Payment.routes";
import ProductRoutes from "./Product.routes";

const routes = () => {
  const router = express.Router();

  router.use("/carts", CartRoutes());
  router.use("/cart-items", CartItemRoutes());
  router.use("/orders", OrderRoutes());
  router.use("/order-items", OrderItemRoutes());
  router.use("/payments", PaymentRoutes());
  router.use("/products", ProductRoutes());

  return router;
};

export default routes;
