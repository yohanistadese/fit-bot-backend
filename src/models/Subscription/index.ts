import { Sequelize } from "sequelize";
import SubscriptionPlanFactory, { SubscriptionPlan } from "./SubscriptionPlan";
import SubscriptionFactory, { Subscription } from "./Subscription";
import TransactionFactory, { Transaction } from "./Transaction";
import { User } from "../User";

const SubscriptionModels = (sequelize: Sequelize) => {
  SubscriptionPlanFactory(sequelize);
  SubscriptionFactory(sequelize);
  TransactionFactory(sequelize);

  // User - Subscription (1:Many)
  User.hasMany(Subscription, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Subscription.belongsTo(User, {
    foreignKey: "user_id",
  });

  // SubscriptionPlan - Subscription (1:Many)
  SubscriptionPlan.hasMany(Subscription, {
    foreignKey: "subscription_plan_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Subscription.belongsTo(SubscriptionPlan, {
    foreignKey: "subscription_plan_id",
  });

  // User - Transaction (1:Many)
  User.hasMany(Transaction, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Transaction.belongsTo(User, {
    foreignKey: "user_id",
  });

  // Subscription - Transaction (1:Many)
  Subscription.hasMany(Transaction, {
    foreignKey: "subscription_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Transaction.belongsTo(Subscription, {
    foreignKey: "subscription_id",
  });
};

export default SubscriptionModels;
export { SubscriptionPlan, Subscription, Transaction };
