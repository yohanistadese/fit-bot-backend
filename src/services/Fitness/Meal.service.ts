import { Transaction } from "sequelize";
import async from "async";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../middleware/Error";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { createTransaction } from "../../database/sequelize";
import { Meal } from "../../models/Fitness";
import { MealDAL } from "../../dals/Fitness";
import { User } from "../../models/User";
import { LogActions } from "../../utilities/constants/Constants";
import { ActionLogService } from "../User";
import { GlobalAuthOptionsNew } from "../../middleware/Auth/Auth";

const ModelName = "Meal";

class MealService {
  static AuthOptions = (user: User, options: any, paranoid?: boolean) => {
    return GlobalAuthOptionsNew(user, options, null, null, paranoid);
  };

  static create = (
    user: User,
    payload: Omit<Meal, NullishPropertiesOf<Meal>>
  ): Promise<Meal> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            MealDAL.findOne({ where: { name: payload.name } })
              .then((existing) => {
                if (existing) {
                  done(
                    new BadRequestError([
                      `${ModelName} with this name already exists`,
                    ])
                  );
                } else done(null);
              })
              .catch((error) => done(new InternalServerError(error)));
          },
          (done: Function) => {
            MealDAL.create(payload)
              .then((result) => done(null, result))
              .catch((error) => done(new InternalServerError(error)));
          },
          (result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${LogActions.CREATE}`,
              object: ModelName,
              prev_data: {},
              new_data: result,
              user_id: user.id,
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
      const auth = MealService.AuthOptions(user, options, paranoid);
      MealDAL.findOne(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findMany = (user: User, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = MealService.AuthOptions(user, options, paranoid);
      MealDAL.findMany(auth.options, auth.paranoid)
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
      const auth = MealService.AuthOptions(user, options, paranoid);
      MealDAL.findById(id, auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static update = (
    user: User,
    id: string,
    payload: any,
    options?: any
  ): Promise<Meal> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            MealService.findById(user, id, options)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: Meal, done: Function) => {
            const prev = { ...obj.toJSON() };
            MealDAL.update(obj, payload, transaction)
              .then((result) => done(null, prev, { obj: result, transaction }))
              .catch((e) => done(new InternalServerError(e)));
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
            MealService.findById(user, id, options, force)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: Meal, done: Function) => {
            MealDAL.delete({ id: obj.id }, transaction, force)
              .then((result) => done(null, obj, { obj: result, transaction }))
              .catch((e) => done(new InternalServerError(e)));
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
            MealService.findById(user, id, options, true)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: Meal, done: Function) => {
            MealDAL.restore({ id: obj.id }, transaction)
              .then((result) => done(null, obj, { obj: result, transaction }))
              .catch((e) => done(new InternalServerError(e)));
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
}

export default MealService;
