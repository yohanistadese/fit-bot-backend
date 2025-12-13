import { DataTypes, Model, Sequelize } from "sequelize";
import {
  PayementMethod,
  TransactionStatus,
} from "../../utilities/constants/Constants";

export class Transaction extends Model {
  public id!: string;
  public user_id!: string;
  public subscription_id!: string;
  public amount!: number;
  public payment_method!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Transaction.init(
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
      subscription_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: PayementMethod.STRIPE,
        validate: {
          isIn: [Object.values(PayementMethod)],
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: TransactionStatus.PENDING,
        validate: {
          isIn: [Object.values(TransactionStatus)],
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "transaction",
      tableName: "transactions",
      indexes: [
        {
          fields: ["user_id"],
        },
        { fields: ["subscription_id"] },
      ],
    }
  );
};
