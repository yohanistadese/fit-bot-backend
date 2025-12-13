import { DataTypes, Model, Sequelize } from "sequelize";
import { SubscriptionStatus } from "../../utilities/constants/Constants";

export class Subscription extends Model {
  public id!: string;
  public user_id!: string;
  public subscription_plan_id!: string;
  public stripe_payment_intent_id!: string;
  public stripe_checkout_session_id!: string;
  public stripe_customer_id!: string;
  public start_date!: Date;
  public end_date!: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Subscription.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      subscription_plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stripe_payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripe_checkout_session_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripe_customer_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: SubscriptionStatus.PENDING,
        validate: {
          isIn: [Object.values(SubscriptionStatus)],
        },
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "subscription",
      tableName: "subscriptions",
      indexes: [{ fields: ["user_id"] }],
    }
  );
};
