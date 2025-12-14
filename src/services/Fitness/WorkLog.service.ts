import { Transaction } from "sequelize";
import async from "async";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../middleware/Error";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { createTransaction } from "../../database/sequelize";
import { WorkLog } from "../../models/Fitness";
import { WorkLogDAL } from "../../dals/Fitness";
import { PlanItemDAL } from "../../dals/Fitness";
import { ExerciseDAL } from "../../dals/Fitness";
import { User } from "../../models/User";
import { LogActions } from "../../utilities/constants/Constants";
import { ActionLogService } from "../User";
import { GlobalAuthOptionsNew } from "../../middleware/Auth/Auth";

const ModelName = "Work Log";

class WorkLogService {
  static AuthOptions = (user: User, options: any, paranoid?: boolean) => {
    return GlobalAuthOptionsNew(user, options, null, null, paranoid);
  };

  static create = (
    user: User,
    payload: Omit<WorkLog, NullishPropertiesOf<WorkLog>>
  ): Promise<WorkLog> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            async.parallel(
              {
                planItem: (cb: Function) => {
                  if (!payload.plan_item_id) return cb(null, null);
                  PlanItemDAL.findOne({ where: { id: payload.plan_item_id } })
                    .then((pi) => {
                      if (!pi) cb(new NotFoundError("Plan Item not found"));
                      else cb(null, pi);
                    })
                    .catch((e) => cb(new InternalServerError(e)));
                },
                exercise: (cb: Function) => {
                  ExerciseDAL.findOne({ where: { id: payload.exercise_id } })
                    .then((ex) => {
                      if (!ex) cb(new NotFoundError("Exercise not found"));
                      else cb(null, ex);
                    })
                    .catch((e) => cb(new InternalServerError(e)));
                },
              },
              (err: any) => {
                if (err) done(err);
                else done(null);
              }
            );
          },
          // Create WorkLog
          (done: Function) => {
            WorkLogDAL.create(payload)
              .then((result) => done(null, result))
              .catch((e) => done(new InternalServerError(e)));
          },
          // Log creation
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
      const auth = WorkLogService.AuthOptions(user, options, paranoid);
      WorkLogDAL.findOne(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findMany = (user: User, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = WorkLogService.AuthOptions(user, options, paranoid);
      WorkLogDAL.findMany(auth.options, auth.paranoid)
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
      const auth = WorkLogService.AuthOptions(user, options, paranoid);
      WorkLogDAL.findById(id, auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static update = (
    user: User,
    id: string,
    payload: any,
    options?: any
  ): Promise<WorkLog> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            WorkLogService.findById(user, id, options)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: WorkLog, done: Function) => {
            const prev = { ...obj.toJSON() };
            WorkLogDAL.update(obj, payload, transaction)
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
            WorkLogService.findById(user, id, options, force)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: WorkLog, done: Function) => {
            WorkLogDAL.delete({ id: obj.id }, transaction, force)
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
            WorkLogService.findById(user, id, options, true)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: WorkLog, done: Function) => {
            WorkLogDAL.restore({ id: obj.id }, transaction)
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

export default WorkLogService;
