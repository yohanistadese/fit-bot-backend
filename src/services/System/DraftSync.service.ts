import { Transaction, Op } from "sequelize";
import async from "async";
import { InternalServerError, NotFoundError } from "../../middleware/Error";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { DraftSync, DraftSyncStatus } from "../../models/System/DraftSync";
import { DraftSyncDAL } from "../../dals/System";
import { LogActions } from "../../utilities/constants/Constants";
import { ActionLogService } from "../User";
import { User } from "../../models/User";
import { GlobalAuthOptionsNew } from "../../middleware/Auth/Auth";
import { createTransaction } from "../../database/sequelize";

const ModelName = "Draft Sync";

class DraftSyncService {
  static AuthOptions = (user: User, options: any, paranoid?: boolean) => {
    return GlobalAuthOptionsNew(user, options, null, null, paranoid);
  };

  static create = (
    user: User,
    payload: Omit<DraftSync, NullishPropertiesOf<DraftSync>>
  ): Promise<DraftSync> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            DraftSyncDAL.create({
              ...payload,
              user_id: user.id,
              status: DraftSyncStatus.ACTIVE,
            })
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
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    });
  };

  static findMany = (
    user: User,
    options: any,
    paranoid?: boolean
  ): Promise<{ rows: DraftSync[]; count: number }> => {
    const authOptions = DraftSyncService.AuthOptions(user, options, paranoid);
    return DraftSyncDAL.findMany(
      authOptions.options,
      authOptions.paranoid
    ).catch((err) => {
      throw new InternalServerError(err);
    });
  };

  static findById = (
    user: User,
    id: string,
    options?: any,
    paranoid?: boolean
  ): Promise<DraftSync | null> => {
    const authOptions = DraftSyncService.AuthOptions(user, options, paranoid);
    return DraftSyncDAL.findById(
      id,
      authOptions.options,
      authOptions.paranoid
    ).catch((err) => {
      throw new InternalServerError(err);
    });
  };

  static findOne = (
    user: User,
    options: any,
    paranoid?: boolean
  ): Promise<DraftSync | null> => {
    const authOptions = DraftSyncService.AuthOptions(user, options, paranoid);
    return DraftSyncDAL.findOne(
      authOptions.options,
      authOptions.paranoid
    ).catch((err) => {
      throw new InternalServerError(err);
    });
  };

  static update = (
    user: User,
    id: string,
    payload: Omit<DraftSync, NullishPropertiesOf<DraftSync>>,
    options?: any
  ): Promise<DraftSync> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => {
            createTransaction()
              .then((transaction) => done(null, transaction))
              .catch((err) => reject(new InternalServerError(err)));
          },
          (transaction: Transaction, done: Function) => {
            DraftSyncService.findById(user, id, options)
              .then((draft) => {
                if (!draft) {
                  done(new NotFoundError(`${ModelName} Not Found`), {
                    obj: null,
                    transaction,
                  });
                } else {
                  done(null, transaction, draft);
                }
              })
              .catch((err) =>
                done(new InternalServerError(err), { obj: null, transaction })
              );
          },
          (transaction: Transaction, draft: DraftSync, done: Function) => {
            const prev_data = { ...draft.toJSON() };
            DraftSyncDAL.update(draft, payload, transaction)
              .then((updated) =>
                done(null, prev_data, { obj: updated, transaction })
              )
              .catch((err) =>
                done(new InternalServerError(err), { obj: null, transaction })
              );
          },
          (prev_data: any, result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${LogActions.UPDATE}`,
              object: ModelName,
              prev_data,
              new_data: result.obj,
              user_id: user.id,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (
          error,
          result: { obj: DraftSync; transaction: Transaction } | undefined
        ) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(result.obj);
          } else if (error && result?.transaction) {
            result.transaction.rollback();
            reject(error);
          } else {
            reject(new InternalServerError("Dead End"));
          }
        }
      );
    });
  };

  static delete = (
    user: User,
    id: string,
    options?: any,
    force?: boolean
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => createTransaction().then((tx) => done(null, tx)),
          (transaction: Transaction, done: Function) => {
            DraftSyncService.findById(user, id, options, force)
              .then((draft) => {
                if (!draft)
                  done(new NotFoundError(`${ModelName} Not Found`), {
                    obj: null,
                    transaction,
                  });
                else done(null, transaction, draft);
              })
              .catch((err) => done(new InternalServerError(err)));
          },
          (transaction: Transaction, draft: DraftSync, done: Function) => {
            DraftSyncDAL.delete({ id: draft.id }, transaction, force)
              .then((res) => done(null, draft, { obj: res, transaction }))
              .catch((err) =>
                done(new InternalServerError(err), { obj: null, transaction })
              );
          },
          (draft: DraftSync, result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${
                force ? LogActions.HARD_DELETE : LogActions.SOFT_DELETE
              }`,
              object: ModelName,
              prev_data: draft,
              new_data: result.obj,
              user_id: user.id,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (error, result: { obj: any; transaction: Transaction } | undefined) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(true);
          } else if (error && result?.transaction) {
            result.transaction.rollback();
            reject(error);
          } else {
            reject(new InternalServerError("Dead End"));
          }
        }
      );
    });
  };

  static restore = (
    user: User,
    id: string,
    options?: any
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => createTransaction().then((tx) => done(null, tx)),
          (transaction: Transaction, done: Function) => {
            DraftSyncService.findById(user, id, options, true)
              .then((draft) => {
                if (!draft)
                  done(new NotFoundError(`${ModelName} Not Found`), {
                    obj: null,
                    transaction,
                  });
                else done(null, transaction, draft);
              })
              .catch((err) => done(new InternalServerError(err)));
          },
          (transaction: Transaction, draft: DraftSync, done: Function) => {
            DraftSyncDAL.restore({ id: draft.id }, transaction)
              .then((res) => done(null, draft, { obj: res, transaction }))
              .catch((err) =>
                done(new InternalServerError(err), { obj: null, transaction })
              );
          },
          (draft: DraftSync, result: any, done: Function) => {
            ActionLogService.handleCreate({
              action: `${ModelName} ${LogActions.RESTORE}`,
              object: ModelName,
              prev_data: draft,
              new_data: result.obj,
              user_id: user.id,
              user_email: user?.email,
              ip_address: user?.ip_address,
            });
            done(null, result);
          },
        ],
        (error, result: { obj: any; transaction: Transaction } | undefined) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(true);
          } else if (error && result?.transaction) {
            result.transaction.rollback();
            reject(error);
          } else {
            reject(new InternalServerError("Dead End"));
          }
        }
      );
    });
  };

  static bulkDelete = (
    user: User,
    ids: string[],
    options?: any,
    force = false
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      async.waterfall(
        [
          (done: Function) => createTransaction().then((tx) => done(null, tx)),
          (transaction: Transaction, done: Function) => {
            DraftSyncService.findMany(user, {
              where: { id: { [Op.in]: ids } },
              ...options,
            })
              .then((result) => {
                const drafts = result.rows;
                const foundIds = drafts.map((d) => d.id);
                const missingIds = ids.filter((id) => !foundIds.includes(id));
                if (missingIds.length)
                  done(
                    new NotFoundError(
                      `These drafts not found: ${missingIds.join(", ")}`
                    ),
                    { obj: null, transaction }
                  );
                else done(null, transaction, drafts);
              })
              .catch((err) => done(new InternalServerError(err)));
          },
          (transaction: Transaction, drafts: DraftSync[], done: Function) => {
            DraftSyncDAL.bulk_delete({ id: ids }, transaction, force)
              .then((res) => done(null, drafts, { obj: res, transaction }))
              .catch((err) =>
                done(new InternalServerError(err), { obj: null, transaction })
              );
          },
          (drafts: DraftSync[], result: any, done: Function) => {
            drafts.forEach((draft) => {
              ActionLogService.handleCreate({
                action: `${ModelName} ${
                  force ? LogActions.HARD_DELETE : LogActions.SOFT_DELETE
                }`,
                object: ModelName,
                prev_data: draft,
                new_data: null,
                user_id: user.id,
                user_email: user?.email,
                ip_address: user?.ip_address,
              });
            });
            done(null, result);
          },
        ],
        (error, result: { obj: any; transaction: Transaction } | undefined) => {
          if (!error && result?.transaction) {
            result.transaction.commit();
            resolve(true);
          } else if (error && result?.transaction) {
            result.transaction.rollback();
            reject(error);
          } else {
            reject(new InternalServerError("Dead End"));
          }
        }
      );
    });
  };
}

export default DraftSyncService;
