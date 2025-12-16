import { DataTypes, Model, Sequelize } from "sequelize";

export class Exercise extends Model {
  public id!: string;
  public name!: string;
  public slug!: string;
  public gif_url!: string;
  public primary_muscle_group!: string;
  public secondary_muscle_groups!: object;
  public equipment!: string;
  public difficulty!: string;
  public reps!: number;
  public sets!: number;
  public rest!: number;
  public metadata!: object;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Exercise.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gif_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      primary_muscle_group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      secondary_muscle_groups: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      equipment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rest: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
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
      modelName: "exercise",
      tableName: "exercises",
      indexes: [
        {
          fields: ["slug"],
        },
        { fields: ["primary_muscle_group"] },
      ],
    }
  );
};
