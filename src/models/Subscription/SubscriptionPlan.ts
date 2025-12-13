import { DataTypes, Model, Sequelize } from "sequelize";

export class SubscriptionPlan extends Model {
  public id!: string;
  public name!: string;
  public price!: number;
  public currency!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const SubscriptionPlanModel = (sequelize: Sequelize) => {
  SubscriptionPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "subscription_plan",
      tableName: "subscription_plans",
    }
  );
};
