import { Sequelize } from "sequelize";
import UserModels from "./User";
import SystemModels from "./System";
import ProductModels from "./Product";
import FitnessModels from "./Fitness";
import ChatModels from "./Chat";

const ModelSync = (sequelize: Sequelize) => {
  SystemModels(sequelize);
  UserModels(sequelize);
  ProductModels(sequelize);
  FitnessModels(sequelize);
  ChatModels(sequelize);
};

export { ModelSync };
