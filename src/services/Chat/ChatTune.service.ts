import { Transaction } from "sequelize";
import async from "async";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../middleware/Error";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { createTransaction } from "../../database/sequelize";
import { ChatTune } from "../../models/Chat";
import { LogActions } from "../../utilities/constants/Constants";
import { ActionLogService } from "../User";
import { GlobalAuthOptionsNew } from "../../middleware/Auth/Auth";
import { ChatTuneDAL } from "../../dals/Chat";

const ModelName = "ChatTune";

class ChatTuneService {
  static AuthOptions = (user: any, options: any, paranoid?: boolean) => {
    return GlobalAuthOptionsNew(user, options, null, null, paranoid);
  };

  static create = (
    user: any,
    payload: Omit<ChatTune, NullishPropertiesOf<ChatTune>>
  ): Promise<ChatTune> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            ChatTuneDAL.findOne({ where: { id: payload.id } })
              .then((existing) => {
                if (existing) {
                  done(
                    new BadRequestError([
                      `${ModelName} with ID '${payload.id}' already exists`,
                    ])
                  );
                } else done(null);
              })
              .catch((error) => done(new InternalServerError(error)));
          },
          (done: Function) => {
            ChatTuneDAL.create(payload)
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

  static findOne = (user: any, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = ChatTuneService.AuthOptions(user, options, paranoid);
      ChatTuneDAL.findOne(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findMany = (user: any, options: any, paranoid?: boolean) => {
    return new Promise((resolve, reject) => {
      const auth = ChatTuneService.AuthOptions(user, options, paranoid);
      ChatTuneDAL.findMany(auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static findById = (
    user: any,
    id: string,
    options?: any,
    paranoid?: boolean
  ) => {
    return new Promise((resolve, reject) => {
      const auth = ChatTuneService.AuthOptions(user, options, paranoid);
      ChatTuneDAL.findById(id, auth.options, auth.paranoid)
        .then(resolve)
        .catch((e) => reject(new InternalServerError(e)));
    });
  };

  static update = (
    user: any,
    id: string,
    payload: any,
    options?: any
  ): Promise<ChatTune> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            ChatTuneService.findById(user, id, options)
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
          (transaction: Transaction, obj: ChatTune, done: Function) => {
            const prev = { ...obj.toJSON() };
            ChatTuneDAL.update(obj, payload, transaction)
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

  static delete = (user: any, id: string, options?: any, force?: boolean) => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            ChatTuneService.findById(user, id, options, force)
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
          (transaction: Transaction, obj: ChatTune, done: Function) => {
            ChatTuneDAL.delete({ id: obj.id }, transaction, force)
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

  static restore = (user: any, id: string, options?: any) => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((t) => done(null, t))
              .catch((e) => reject(new InternalServerError(e)));
          },
          (transaction: Transaction, done: Function) => {
            ChatTuneService.findById(user, id, options, true)
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
          (transaction: Transaction, obj: ChatTune, done: Function) => {
            ChatTuneDAL.restore({ id: obj.id }, transaction)
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
}

export default ChatTuneService;
