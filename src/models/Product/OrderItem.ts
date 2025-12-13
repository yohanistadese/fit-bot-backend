import { DataTypes, Model, Sequelize } from "sequelize";

export class OrderItem extends Model {
  public id!: string;
  public order_id!: string;
  public product_id!: string;
  public quantity!: number;
  public unit_price!: number;
  public total_price!: number;
  public metadata!: object | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  OrderItem.init(
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
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.FLOAT,
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
      modelName: "order_item",
      tableName: "order_items",
      indexes: [
        {
          fields: ["order_id"],
        },
        { fields: ["product_id"] },
      ],
    }
  );
};
