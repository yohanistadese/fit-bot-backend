import { DataTypes, Model, Sequelize } from "sequelize";
import { UserRole, UserStatus } from "../../utilities/constants/Constants";

export class User extends Model {
  public id!: string;
  public status!: string;
  public role!: string;
  public telegram_user_id!: string;
  public telegram_user_name!: string;
  public email!: string;
  public name!: string;
  public is_subscriber!: boolean;
  public stripe_customer_id!: string;
  public ip_address!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: UserStatus.PENDING,
        validate: {
          isIn: [Object.values(UserStatus)],
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: UserRole.USER,
        validate: {
          isIn: [Object.values(UserRole)],
        },
      },
      telegram_user_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegram_user_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_subscriber: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      stripe_customer_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "user",
      tableName: "users",
      indexes: [
        { fields: ["telegram_user_id"] },
        { fields: ["email"] },
        { fields: ["stripe_customer_id"] },
      ],
    }
  );
};
