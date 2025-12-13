import { DataTypes, Model, Sequelize } from "sequelize";
import { PaymentStatus } from "../../utilities/constants/Constants";

export class Payment extends Model {
  public id!: string;
  public order_id!: string;
  public user_id!: string;
  public stripe_payment_intent_id!: string;
  public stripe_charge_id!: string;
  public amount!: number;
  public currency!: string;
  public status!: string;
  public raw_event!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stripe_payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripe_charge_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
        validate: {
          isIn: [Object.values(PaymentStatus)],
        },
      },
      raw_event: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "payment",
      tableName: "payments",
      indexes: [
        { fields: ["order_id"] },
        { fields: ["user_id"] },
        { fields: ["status"] },
      ],
    }
  );
};
