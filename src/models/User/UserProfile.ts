import { DataTypes, Model, Sequelize } from "sequelize";

export class UserProfile extends Model {
  public id!: string;
  public user_id!: string;
  public goals!: string | null;
  public injuries!: string | null;
  public experience_level!: string | null;
  public available_equipment!: string | null;
  public training_days_per_week!: number | null;
  public diet_preference!: string | null;
  public dietary_restrictions!: string | null;
  public other_preferences!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  UserProfile.init(
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
      goals: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      injuries: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience_level: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      available_equipment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      training_days_per_week: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      diet_preference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dietary_restrictions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      other_preferences: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "user_profile",
      tableName: "user_profiles",
      indexes: [{ fields: ["user_id"] }],
    }
  );
};
