import { DataTypes, Model, Sequelize } from "sequelize";

export class PlanItem extends Model {
  public id!: string;
  public meal_id!: string;
  public weekly_plan_id!: string;
  public exercise_id!: string;
  public user_id!: string;
  public type!: string;
  public title!: string;
  public description!: string;
  public scheduled_time!: string;
  public order_index!: number;
  public is_overridden!: boolean;
  public reps!: number;
  public sets!: number;
  public rest!: number;
  public date!: Date;
  public metadata!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  PlanItem.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      meal_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      weekly_plan_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      exercise_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      scheduled_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_overridden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rest: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "plan_item",
      tableName: "plan_items",
      indexes: [
        { fields: ["plan_day_id"] },
        { fields: ["user_id"] },
        { fields: ["exercise_id"] },
      ],
    }
  );
};
