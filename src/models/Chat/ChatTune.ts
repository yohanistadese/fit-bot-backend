import { DataTypes, Model, Sequelize } from "sequelize";

export class ChatTune extends Model {
  public id!: string;
  public user_id!: string;
  public conversation_session_id!: string;
  public user_message!: string;
  public assistant_message!: string;
  public intent!: string;
  public metadata!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  ChatTune.init(
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
      conversation_session_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      user_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assistant_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      intent: {
        type: DataTypes.STRING,
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
      modelName: "chat_tune",
      tableName: "chat_tunes",
      indexes: [
        { fields: ["user_id"] },
        { fields: ["conversation_session_id"] },
      ],
    }
  );
};
