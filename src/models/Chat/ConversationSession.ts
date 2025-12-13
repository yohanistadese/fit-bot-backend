import { DataTypes, Model, Sequelize } from "sequelize";

export class ConversationSession extends Model {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  ConversationSession.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "conversation_session",
      tableName: "conversation_sessions",
      indexes: [
        {
          fields: ["user_id"],
        },
      ],
    }
  );
};
