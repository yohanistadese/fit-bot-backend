import { DataTypes, Model, Sequelize } from "sequelize";

export class Product extends Model {
  public id!: string;
  public name!: string;
  public slug!: string;
  public category!: string;
  public price!: number;
  public currency!: string;
  public is_active!: boolean;
  public description!: string;
  public knowledge_base_reference!: object;
  public metadata!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      knowledge_base_reference: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "product",
      tableName: "products",
      indexes: [
        { fields: ["slug"] },
        { fields: ["category"] },
        { fields: ["is_active"] },
      ],
    }
  );
};
