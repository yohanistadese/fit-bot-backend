import { DataTypes, Model, Sequelize } from "sequelize";

export class WeeklyPlan extends Model {
  public id!: string;
  public user_id!: string;
  public start_date!: Date;
  public end_date!: Date;
  public generated_by!: string;
  public metadata!: object | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  WeeklyPlan.init(
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
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      generated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "weekly_plan",
      tableName: "weekly_plans",
      indexes: [
        {
          fields: ["user_id"],
        },
      ],
    }
  );
};
