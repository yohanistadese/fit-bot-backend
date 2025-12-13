import { Sequelize } from "sequelize";
import WeeklyPlanFactory, { WeeklyPlan } from "./WeeklyPlan";
import PlanDayFactory, { PlanDay } from "./PlanDay";
import PlanItemFactory, { PlanItem } from "./PlanItem";
import ExerciseFactory, { Exercise } from "./Exercise";
import WorkLogFactory, { WorkLog } from "./WorkLog";
import MealFactory, { Meal } from "./Meal";
import { User } from "../User";

const FitnessModels = (sequelize: Sequelize) => {
  WeeklyPlanFactory(sequelize);
  PlanDayFactory(sequelize);
  PlanItemFactory(sequelize);
  ExerciseFactory(sequelize);
  WorkLogFactory(sequelize);
  MealFactory(sequelize);

  // User - WeeklyPlan (1:Many)
  User.hasMany(WeeklyPlan, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  WeeklyPlan.belongsTo(User, {
    foreignKey: "user_id",
  });

  // WeeklyPlan - PlanDay (1:Many)
  WeeklyPlan.hasMany(PlanDay, {
    foreignKey: "weekly_plan_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PlanDay.belongsTo(WeeklyPlan, {
    foreignKey: "weekly_plan_id",
  });

  // User - PlanDay (1:Many)
  User.hasMany(PlanDay, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PlanDay.belongsTo(User, {
    foreignKey: "user_id",
  });

  // PlanDay - PlanItem (1:Many)
  PlanDay.hasMany(PlanItem, {
    foreignKey: "plan_day_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PlanItem.belongsTo(PlanDay, {
    foreignKey: "plan_day_id",
  });

  // User - PlanItem (1:Many)
  User.hasMany(PlanItem, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PlanItem.belongsTo(User, {
    foreignKey: "user_id",
  });

  // Exercise - PlanItem (1:Many)
  Exercise.hasMany(PlanItem, {
    foreignKey: "exercise_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PlanItem.belongsTo(Exercise, {
    foreignKey: "exercise_id",
  });

  // User - WorkLog (1:Many)
  User.hasMany(WorkLog, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  WorkLog.belongsTo(User, { foreignKey: "user_id" });

  // PlanItem - WorkLog (1:Many)
  PlanItem.hasMany(WorkLog, {
    foreignKey: "plan_item_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  WorkLog.belongsTo(PlanItem, {
    foreignKey: "plan_item_id",
  });

  // Exercise - WorkLog (1:Many)
  Exercise.hasMany(WorkLog, {
    foreignKey: "exercise_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  WorkLog.belongsTo(Exercise, {
    foreignKey: "exercise_id",
  });

  // Meal - PlanItem (1:Many)
  Meal.hasMany(PlanItem, {
    foreignKey: "meal_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  PlanItem.belongsTo(Meal, {
    foreignKey: "meal_id",
  });
};

export default FitnessModels;
export { WeeklyPlan, PlanDay, PlanItem, Exercise, WorkLog, Meal };
