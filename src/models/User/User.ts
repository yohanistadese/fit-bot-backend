import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public telegram_user_id!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telegram_user_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "user",
      tableName: "users",
      defaultScope: {
        attributes: { exclude: [] },
      },
      indexes: [
        {
          fields: ["telegram_user_id"],
        },
        {
          fields: ["status"],
        },
      ],
    }
  );
};
