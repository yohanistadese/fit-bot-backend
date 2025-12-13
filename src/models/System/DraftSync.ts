import { DataTypes, Model, Sequelize } from "sequelize";

export const DraftSyncType = {
  INVESTMENT: "investment",
  PROFILE: "profile",
} as const;

export const DraftSyncStatus = {
  ACTIVE: "active",
  CLEARED: "cleared",
} as const;

export class DraftSync extends Model {
  public id!: string;
  public user_id!: string;
  public type!: string;
  public payload!: object;
  public last_section!: string | null;
  public status!: string;
  public expires_at!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  DraftSync.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DraftSyncType.INVESTMENT,
        validate: {
          isIn: [Object.values(DraftSyncType)],
        },
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      last_section: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DraftSyncStatus.ACTIVE,
        validate: {
          isIn: [Object.values(DraftSyncStatus)],
        },
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "draft_sync",
      tableName: "draft_syncs",
      indexes: [
        {
          fields: ["user_id", "type"],
        },
        {
          fields: ["status"],
        },
      ],
    }
  );
};
