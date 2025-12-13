import express from "express";
import ExerciseRoutes from "./Exercise.routes";
import MealRoutes from "./Meal.routes";
import PlanDayRoutes from "./PlanDay.routes";
import PlanItemRoutes from "./PlanItem.routes";
import WeeklyPlanRoutes from "./WeeklyPlan.routes";
import WorkLogRoutes from "./WorkLog.routes";

const routes = () => {
  const router = express.Router();

  router.use("/exercises", ExerciseRoutes());
  router.use("/meals", MealRoutes());
  router.use("/plan-days", PlanDayRoutes());
  router.use("/plan-items", PlanItemRoutes());
  router.use("/weekly-plans", WeeklyPlanRoutes());
  router.use("/work-logs", WorkLogRoutes());

  return router;
};

export default routes;
