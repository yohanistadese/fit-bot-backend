import express from "express";
import SubscriptionRoutes from "./Subscription.routes";
import SubscriptionPlanRoutes from "./SubscriptionPlan.routes";
import TransactionRoutes from "./Transaction.routes";

const routes = () => {
  const router = express.Router();

  router.use("/subscriptions", SubscriptionRoutes);
  router.use("/subscription-plans", SubscriptionPlanRoutes);
  router.use("/transactions", TransactionRoutes);

  return router;
};

export default routes;
