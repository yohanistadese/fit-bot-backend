import { DataTypes, Model, Sequelize } from "sequelize";

export class PlanDay extends Model {
  public id!: string;
  public weekly_plan_id!: string;
  public user_id!: string;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  PlanDay.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      weekly_plan_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "plan_day",
      tableName: "plan_days",
      indexes: [
        {
          fields: ["weekly_plan_id"],
        },
        { fields: ["user_id"] },
      ],
    }
  );
};
