import { DataTypes, Model, Sequelize } from "sequelize";

export class Meal extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public calories!: number;
  public protein!: number;
  public carbs!: number;
  public fats!: number;
  public tags!: object;
  public metadata!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Meal.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      calories: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      protein: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      carbs: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fats: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tags: {
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
      modelName: "meal",
      tableName: "meals",
      indexes: [{ fields: ["name"] }],
    }
  );
};
