import { Sequelize } from "sequelize";
import ActionLogFactory, { ActionLog } from "./ActionLog";
import UserFactory, { User } from "./User";
import UserNotificationTimeFactory, {
  UserNotificationTime,
} from "./UserNotificationTime";
import UserProfileFactory, { UserProfile } from "./UserProfile";
import { DraftSync, File } from "../System";

const UserModels = (sequelize: Sequelize) => {
  ActionLogFactory(sequelize);
  UserFactory(sequelize);
  UserNotificationTimeFactory(sequelize);
  UserProfileFactory(sequelize);

  // User - Action Log
  User.hasMany(ActionLog, {
    foreignKey: "user_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
  ActionLog.belongsTo(User, {
    foreignKey: "user_id",
  });

  // User - User Profile
  User.hasOne(UserProfile, {
    foreignKey: "user_id",
  });
  UserProfile.belongsTo(User, {
    foreignKey: "user_id",
  });

  // File - UserProfile
  File.hasOne(UserProfile, {
    foreignKey: "file_id",
  });
  UserProfile.belongsTo(File, {
    foreignKey: "file_id",
  });

  // User - DraftSync (1:Many)
  User.hasMany(DraftSync, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  DraftSync.belongsTo(User, {
    foreignKey: "user_id",
  });

  // User - UserNotificationTime (1:Many)
  User.hasOne(UserNotificationTime, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  UserNotificationTime.belongsTo(User, {
    foreignKey: "user_id",
  });
};

export default UserModels;
export { ActionLog, User, UserProfile, UserNotificationTime };
