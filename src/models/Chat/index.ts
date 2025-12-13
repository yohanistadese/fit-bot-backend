import { Sequelize } from "sequelize";
import ConversationSessionFactory, {
  ConversationSession,
} from "./ConversationSession";
import ChatTuneFactory, { ChatTune } from "./ChatTune";
import { User } from "../User/User";

const ChatModels = (sequelize: Sequelize) => {
  ConversationSessionFactory(sequelize);
  ChatTuneFactory(sequelize);

  // User - ConversationSession (1:Many)
  User.hasMany(ConversationSession, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ConversationSession.belongsTo(User, {
    foreignKey: "user_id",
  });

  // ConversationSession - ChatTune (1:Many)
  ConversationSession.hasMany(ChatTune, {
    foreignKey: "conversation_session_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ChatTune.belongsTo(ConversationSession, {
    foreignKey: "conversation_session_id",
  });

  // User - ChatTune (1:Many)
  User.hasMany(ChatTune, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ChatTune.belongsTo(User, {
    foreignKey: "user_id",
  });
};

export default ChatModels;
export { ConversationSession, ChatTune };
