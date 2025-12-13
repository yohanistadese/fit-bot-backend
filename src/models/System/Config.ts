import { DataTypes, Model, Sequelize } from "sequelize";
import { ConfigType } from "../../utilities/constants/Constants";

export class Config extends Model {
  public id!: string;
  public key!: string;
  public object_type!: string;
  public type!: string;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Config.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      key: {
        type: DataTypes.STRING,
        unique: true,
      },
      object_type: {
        type: DataTypes.STRING,
        defaultValue: ConfigType.JSON,
        validate: {
          isIn: [Object.values(ConfigType)],
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      value: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "config",
      tableName: "configs",
      indexes: [
        {
          unique: true,
          fields: ["key"],
        },
        {
          fields: ["object_type"],
        },
        {
          fields: ["object_type", "key"],
        },
      ],
    }
  );
};
