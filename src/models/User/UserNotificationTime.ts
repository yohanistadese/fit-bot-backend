import { DataTypes, Model, Sequelize } from "sequelize";

export class UserNotificationTime extends Model {
  public id!: string;
  public user_id!: string;
  public preferred_workout_time!: string;
  public time_zone!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  UserNotificationTime.init(
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
      preferred_workout_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time_zone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "user_notification_time",
      tableName: "user_notification_times",
      indexes: [{ fields: ["user_id"] }],
    }
  );
};
