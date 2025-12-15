import { Transaction } from "sequelize";
import async from "async";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../middleware/Error";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { createTransaction } from "../../database/sequelize";
import { User } from "../../models/User";
import {
  LogActions,
  UserRole,
  UserStatus,
} from "../../utilities/constants/Constants";
import { ActionLogService } from "../User";
import { GlobalAuthOptionsNew } from "../../middleware/Auth/Auth";
import { UserDAL } from "../../dals/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { parseExpiry } from "../../utilities/utilities";
import LogService from "../Log/Log.service";
import { env } from "../../config";

const ModelName = "User";

class UserService {
  static AuthOptions = (user: User, options: any, paranoid?: boolean) => {
    return GlobalAuthOptionsNew(user, options, null, null, paranoid);
  };

  static create = (
    user: User,
    payload: Omit<User, NullishPropertiesOf<User>>
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            if (!payload.email) {
              return done(null);
            }
            UserDAL.findOne({ where: { email: payload.email } })
              .then((existing) => {
                if (existing) {
                  done(
                    new BadRequestError([
                      `${ModelName} '${payload.email}' Already Exists`,
                    ])
                  );
                } else done(null);
              })
              .catch((error) => done(error));
          },
          (done: Function) => {
            UserDAL.create(payload)
              .then((result) => done(null, result))
              .catch((error) => done(error));
          },
          (result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${LogActions.CREATE}`,
              object: ModelName,
              prev_data: {},
              new_data: result,
              user_id: user?.id ?? null,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (error, result: any) => {
          if (!error) resolve(result);
          else reject(error);
        }
      );
    });
  };

  static findOne = (user: User, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = UserService.AuthOptions(user, options, paranoid);
      UserDAL.findOne(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findMany = (user: User, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = UserService.AuthOptions(user, options, paranoid);
      UserDAL.findMany(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findById = (
    user: User,
    id: string,
    options?: any,
    paranoid?: boolean
  ) => {
    return new Promise((resolve, reject) => {
      const auth = UserService.AuthOptions(user, options, paranoid);
      UserDAL.findById(id, auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static update = (
    user: User,
    id: string,
    payload: any,
    options?: any
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            UserService.findById(user, id, options)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else
                  done(new NotFoundError(`${ModelName} Not Found`), {
                    obj: null,
                    transaction,
                  });
              })
              .catch((e) =>
                done(new InternalServerError(e), { obj: null, transaction })
              );
          },
          (transaction: Transaction, obj: User, done: Function) => {
            const prev = { ...obj.toJSON() };
            UserDAL.update(obj, payload, transaction)
              .then((result) => done(null, prev, { obj: result, transaction }))
              .catch((e) =>
                done(new InternalServerError(e), { obj: null, transaction })
              );
          },
          (prev: any, result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${LogActions.UPDATE}`,
              object: ModelName,
              prev_data: prev,
              new_data: payload,
              user_id: user.id,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (error, result: any) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(result.obj);
          } else {
            if (result?.transaction) result.transaction.rollback();
            reject(error || new InternalServerError("Dead End"));
          }
        }
      );
    });
  };

  static delete = (user: User, id: string, options?: any, force?: boolean) => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            UserService.findById(user, id, options, force)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else
                  done(new NotFoundError(`${ModelName} Not Found`), {
                    obj: null,
                    transaction,
                  });
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: User, done: Function) => {
            UserDAL.delete({ id: obj.id }, transaction, force)
              .then((result) => done(null, obj, { obj: result, transaction }))
              .catch((e) =>
                done(new InternalServerError(e), { obj: null, transaction })
              );
          },
          (obj: any, result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${
                force ? LogActions.HARD_DELETE : LogActions.SOFT_DELETE
              }`,
              object: ModelName,
              prev_data: { id, options },
              new_data: obj,
              user_id: user.id,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (error, result: any) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(result.obj);
          } else {
            if (result?.transaction) result.transaction.rollback();
            reject(error || new InternalServerError("Dead End"));
          }
        }
      );
    });
  };

  static restore = (user: User, id: string, options?: any) => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            UserService.findById(user, id, options, true)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else
                  done(new NotFoundError(`${ModelName} Not Found`), {
                    obj: null,
                    transaction,
                  });
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: User, done: Function) => {
            UserDAL.restore({ id: obj.id }, transaction)
              .then((result) => done(null, obj, { obj: result, transaction }))
              .catch((e) =>
                done(new InternalServerError(e), { obj: null, transaction })
              );
          },
          (obj: any, result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${LogActions.RESTORE}`,
              object: ModelName,
              prev_data: { id, options },
              new_data: obj,
              user_id: user.id,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (error, result: any) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(result.obj);
          } else {
            if (result?.transaction) result.transaction.rollback();
            reject(error || new InternalServerError("Dead End"));
          }
        }
      );
    });
  };

  static telegramRegister = async (payload: Partial<User>): Promise<User> => {
    let transaction: Transaction | null = null;
    try {
      transaction = await createTransaction();

      if (
        payload?.role === UserRole.SYSTEM ||
        payload?.role === UserRole.ADMIN
      ) {
        throw new BadRequestError([
          "System or Admin users cannot register via this endpoint",
        ]);
      }

      if (payload.email) {
        const existingEmail = await UserDAL.findOne({
          where: { email: payload.email.toLowerCase() },
        });
        if (existingEmail) {
          throw new BadRequestError(["Email Already Registered"]);
        }
      }

      if (payload.telegram_user_id) {
        const existingTelegram = await UserDAL.findOne({
          where: { telegram_user_id: payload.telegram_user_id },
        });
        if (existingTelegram) {
          throw new BadRequestError(["Telegram User Already Registered"]);
        }
      }

      if (payload?.email) {
        payload.email = payload.email.toLowerCase();
      }
      payload.status = UserStatus.PENDING;
      payload.role = payload.role ?? UserRole.USER;

      const user = await UserDAL.create(payload, transaction);

      await ActionLogService.handleCreate({
        action: `${ModelName} ${LogActions.CREATE}`,
        object: ModelName,
        prev_data: {},
        new_data: user,
      });

      await transaction.commit();
      return user;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error || new InternalServerError("Registration failed");
    }
  };

  static telegramLogin = async (initData: string): Promise<any> => {
    try {
      const data: Record<string, string> = Object.fromEntries(
        initData.split("&").map((pair) => pair.split("="))
      );

      const hash = data.hash;
      delete data.hash;

      // Verify Telegram data integrity
      const secretKey = crypto
        .createHash("sha256")
        .update(env.TELEGRAM_BOT_TOKEN!)
        .digest();
      const checkString = Object.keys(data)
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join("\n");

      const hmac = crypto
        .createHmac("sha256", secretKey)
        .update(checkString)
        .digest("hex");

      if (hmac !== hash) {
        throw new UnauthorizedError(
          "Telegram login failed: Data verification error"
        );
      }

      // Find existing user
      let user = await UserDAL.findOne({
        where: { telegram_user_id: data.id },
      });

      // If not exists, create new user
      if (!user) {
        const payload: Partial<User> = {
          telegram_user_id: data.id,
          telegram_user_name: data.username,
          name: `${data.first_name} ${data.last_name || ""}`.trim(),
          status: UserStatus.ACTIVE,
          role: UserRole.USER,
        };
        user = await UserDAL.create(payload);
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.AUTH_KEY!, {
        expiresIn: parseExpiry(process.env.AUTH_KEY_EXPIRY!) / 1000,
      });

      const userData = user.toJSON();
      delete userData.password;

      return { token, user: userData };
    } catch (error) {
      LogService.LogError(`Telegram login failed, ${error}`);
      throw error;
    }
  };
}

export default UserService;
