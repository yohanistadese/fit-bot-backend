import { DataTypes, Model, Sequelize } from "sequelize";

export class WorkLog extends Model {
  public id!: string;
  public user_id!: string;
  public plan_item_id!: string;
  public exercise_id!: string;
  public performed_at!: Date;
  public actual_sets!: object;
  public actual_reps!: object;
  public actual_weight!: number;
  public rpe!: number;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  WorkLog.init(
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
      plan_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      exercise_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      performed_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      actual_sets: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      actual_reps: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      actual_weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      rpe: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "work_log",
      tableName: "work_logs",
      indexes: [
        { fields: ["user_id"] },
        { fields: ["plan_item_id"] },
        { fields: ["exercise_id"] },
      ],
    }
  );
};
