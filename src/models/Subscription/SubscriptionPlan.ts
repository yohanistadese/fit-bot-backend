import { DataTypes, Model, Sequelize } from "sequelize";

export class SubscriptionPlan extends Model {
  public id!: string;
  public name!: string;
  public price!: number;
  public currency!: number;
  public amenities!: string[];
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
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
      amenities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
