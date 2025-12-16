import { Transaction } from "sequelize";
import async from "async";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../middleware/Error";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { createTransaction } from "../../database/sequelize";
import { PlanItem } from "../../models/Fitness";
import { PlanItemDAL } from "../../dals/Fitness";
import { PlanDayDAL } from "../../dals/Fitness";
import { ExerciseDAL } from "../../dals/Fitness";
import { MealDAL } from "../../dals/Fitness";
import { User } from "../../models/User";
import { LogActions } from "../../utilities/constants/Constants";
import { ActionLogService } from "../User";
import { GlobalAuthOptionsNew } from "../../middleware/Auth/Auth";

const ModelName = "Plan Item";

class PlanItemService {
  static AuthOptions = (user: User, options: any, paranoid?: boolean) => {
    return GlobalAuthOptionsNew(user, options, null, null, paranoid);
  };

  static async create(
    user: User,
    payload: Omit<PlanItem, NullishPropertiesOf<PlanItem>>
  ): Promise<PlanItem> {
    if (payload.order_index) {
      const existing = await PlanItemDAL.findOne({
        where: {
          weekly_plan_id: payload.weekly_plan_id,
          order_index: payload.order_index,
        },
      });

      if (existing) {
        throw new BadRequestError([
          `${ModelName} with this order index already exists for the week`,
        ]);
      }
    }

    const result = await PlanItemDAL.create(payload);

    ActionLogService.handleCreate({
      action: `${ModelName} ${LogActions.CREATE}`,
      object: ModelName,
      prev_data: {},
      new_data: result,
      user_id: user.id,
      user_email: user?.email,
      ip_address: user?.ip_address,
    });

    return result;
  }

  static async bulkCreate(
    user: User,
    payload: {
      planItems: {
        meal_id?: string;
        weekly_plan_id: string;
        exercise_id: string;
        user_id: string;
        type?: string;
        title?: string;
        description?: string;
        scheduled_time?: string;
        order_index?: number;
        is_overridden?: boolean;
        reps?: number;
        sets?: number;
        rest?: number;
        metadata?: object;
      }[];
    }
  ): Promise<{ rows: PlanItem[]; count: number }> {
    try {
      const rows = await PlanItem.bulkCreate(payload.planItems);

      ActionLogService.handleCreate({
        action: LogActions.CREATE,
        object: "Plan Item",
        prev_data: {},
        new_data: { message: "Bulk plan items created", count: rows.length },
        user_id: user.id,
        user_email: user?.email,
        ip_address: user?.ip_address,
      });

      return { rows, count: rows.length };
    } catch (error) {
      throw error;
    }
  }

  static findOne = (user: User, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = PlanItemService.AuthOptions(user, options, paranoid);
      PlanItemDAL.findOne(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findMany = (user: User, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = PlanItemService.AuthOptions(user, options, paranoid);
      PlanItemDAL.findMany(auth.options, auth.paranoid)
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
      const auth = PlanItemService.AuthOptions(user, options, paranoid);
      PlanItemDAL.findById(id, auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static update = (
    user: User,
    id: string,
    payload: any,
    options?: any
  ): Promise<PlanItem> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            PlanItemService.findById(user, id, options)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: PlanItem, done: Function) => {
            const prev = { ...obj.toJSON() };
            PlanItemDAL.update(obj, payload, transaction)
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
            PlanItemService.findById(user, id, options, force)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: PlanItem, done: Function) => {
            PlanItemDAL.delete({ id: obj.id }, transaction, force)
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
            PlanItemService.findById(user, id, options, true)
              .then((obj) => {
                if (obj) done(null, transaction, obj);
                else done(new NotFoundError(`${ModelName} Not Found`));
              })
              .catch((e) => done(new InternalServerError(e)));
          },
          (transaction: Transaction, obj: PlanItem, done: Function) => {
            PlanItemDAL.restore({ id: obj.id }, transaction)
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

export default PlanItemService;
