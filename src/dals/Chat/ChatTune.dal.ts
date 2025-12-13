import { Transaction } from "sequelize";
import { ChatTune as BaseModel } from "../../models/Chat";
import BaseDAL from "../Base.dal";

class ChatTuneDAL {
  /**
   *
   *
   * @static
   * @param {Partial<BaseModel>} payload
   * @param {Transaction} t
   * @memChatTunef ChatTuneDAL
   */
  static create = (
    payload: Partial<BaseModel>,
    t?: Transaction
  ): Promise<BaseModel> => {
    return BaseDAL.create<BaseModel>(BaseModel, payload, t);
  };

  /**
   *
   *
   * @static
   * @param {*} options
   * @param paranoid
   * @memChatTunef ChatTuneDAL
   */
  static findMany = (
    options: any,
    paranoid = true
  ): Promise<{ rows: BaseModel[]; count: number }> => {
    return BaseDAL.findMany<BaseModel>(BaseModel, options, paranoid);
  };

  /**
   *
   *
   * @static
   * @param id
   * @param options
   * @param paranoid
   * @memChatTunef ChatTuneDAL
   */
  static findById = (
    id: string,
    options?: any,
    paranoid = true
  ): Promise<BaseModel | null> => {
    return BaseDAL.findById<BaseModel>(BaseModel, id, options, paranoid);
  };

  /**
   *
   *
   * @static
   * @param {*} options
   * @param paranoid
   * @memChatTunef ChatTuneDAL
   */
  static findOne = (
    options: any,
    paranoid = true
  ): Promise<BaseModel | null> => {
    return BaseDAL.findOne<BaseModel>(BaseModel, options, paranoid);
  };

  /**
   *
   *
   * @static
   * @param obj
   * @param {Partial<BaseModel>} payload
   * @param t
   * @memChatTunef ChatTuneDAL
   */
  static update = (
    obj: BaseModel,
    payload: Partial<BaseModel>,
    t?: Transaction
  ): Promise<BaseModel> => {
    return BaseDAL.update<BaseModel>(BaseModel, obj, payload, t);
  };

  /**
   *
   *
   * @static
   * @param rule
   * @param {Partial<BaseModel>} payload
   * @param t
   * @memChatTunef ChatTuneDAL
   */
  static bulk_update = (
    rule: any,
    payload: Partial<BaseModel>,
    t?: Transaction
  ): Promise<boolean> => {
    return BaseDAL.bulk_update<BaseModel>(BaseModel, rule, payload, t);
  };

  /**
   *
   *
   * @static
   * @param {*} query
   * @param t
   * @param force
   * @memChatTunef ChatTuneDAL
   */
  static delete = (
    query: any,
    t?: Transaction,
    force = false
  ): Promise<boolean> => {
    return BaseDAL.delete<BaseModel>(BaseModel, query, t, force);
  };

  /**
   *
   *
   * @static
   * @param rule
   * @param t
   * @param force
   * @memChatTunef ChatTuneDAL
   */
  static bulk_delete = (
    rule: any,
    t?: Transaction,
    force = false
  ): Promise<boolean> => {
    return BaseDAL.bulk_delete<BaseModel>(BaseModel, rule, t, force);
  };

  /**
   *
   *
   * @static
   * @param {*} query
   * @param t
   * @memChatTunef ChatTuneDAL
   */
  static restore = (query: any, t?: Transaction): Promise<boolean> => {
    return BaseDAL.restore<BaseModel>(BaseModel, query, t);
  };

  /**
   *
   *
   * @static
   * @param rule
   * @param t
   * @memChatTunef ChatTuneDAL
   */
  static bulk_restore = (rule: any, t?: Transaction): Promise<boolean> => {
    return BaseDAL.bulk_restore<BaseModel>(BaseModel, rule, t);
  };
}

export default ChatTuneDAL;
