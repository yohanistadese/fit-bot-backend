import { DataTypes, Model, Sequelize } from "sequelize";
import { OrderStatus } from "../../utilities/constants/Constants";

export class Order extends Model {
  public id!: string;
  public user_id!: string;
  public cart_id!: string;
  public stripe_payment_intent_id!: string;
  public stripe_checkout_session_id!: string;
  public status!: string;
  public total_amount!: number;
  public currency!: string;
  public includes_subscription!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Order.init(
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
      cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stripe_payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripe_checkout_session_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: OrderStatus.PENDING,
        validate: {
          isIn: [Object.values(OrderStatus)],
        },
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      includes_subscription: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "order",
      tableName: "orders",
      indexes: [
        { fields: ["user_id"] },
        { fields: ["cart_id"] },
        { fields: ["status"] },
      ],
    }
  );
};
