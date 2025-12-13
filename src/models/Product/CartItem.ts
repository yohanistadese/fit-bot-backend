import { DataTypes, Model, Sequelize } from "sequelize";

export class CartItem extends Model {
  public id!: string;
  public cart_id!: string;
  public product_id!: string;
  public quantity!: number;
  public unit_price!: number;
  public metadata!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      cart_id: {
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
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "cart_item",
      tableName: "cart_items",
      indexes: [
        {
          fields: ["cart_id"],
        },
        { fields: ["product_id"] },
      ],
    }
  );
};
