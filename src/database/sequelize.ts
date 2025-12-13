import { Sequelize, Transaction } from "sequelize";
import { env } from "../config";
import { ModelSync } from "../models";
import LogService from "../services/Log/Log.service";

// Sequelize instance
export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "postgres",
    logging: !env.PRODUCTION ? console.log : false,
    pool: {
      max: 30,
      min: 5,
      acquire: 30000,
      idle: 30000,
      evict: 15000,
    },
    retry: {
      max: 3,
    },
    ...(env.DB_SSL_ENABLED
      ? {
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        }
      : {}),
  }
);

export const initializeDatabase = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    ModelSync(sequelize);
    await sequelize.sync({
      logging: true,
      alter: false,
    });

    LogService.LogInfo(
      "Database connection has been established successfully."
    );
    return true;
  } catch (error: any) {
    console.error(error);
    LogService.LogError(`Database connection error: ${error}`);
    return false;
  }
};

export const createTransaction = async (): Promise<Transaction> => {
  return await sequelize.transaction();
};
