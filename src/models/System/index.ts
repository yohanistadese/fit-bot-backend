import { Sequelize } from "sequelize";
import ConfigFactory, { Config } from "./Config";
import FileFactory, { File } from "./File";
import DraftSyncFactory, { DraftSync } from "./DraftSync";

const SystemModels = (sequelize: Sequelize) => {
  ConfigFactory(sequelize);
  FileFactory(sequelize);
  DraftSyncFactory(sequelize);
};

export default SystemModels;
export { Config, File, DraftSync };
