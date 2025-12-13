import { DataTypes, Model, Sequelize } from "sequelize";

export class ActionLog extends Model {
  public id!: string;
  public action!: string;
  public object!: string;
  public description?: string;
  public prev_data!: any;
  public new_data!: any;
  public user_email?: string;
  public ip_address?: string;
  public target?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  ActionLog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      object: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      prev_data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      new_data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      target: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "action_log",
      tableName: "action_logs",
      indexes: [{ fields: ["action"] }, { fields: ["object"] }],
    }
  );
};
