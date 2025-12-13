export const PasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{8,16}$/;
// Email must be a valid address and end with a TLD of at least 3 letters
export const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{3,}$/;

// Phone must include country code, minimum 10 digits total (E.164 compliant)
export const PhoneNumberRegex = /^\+[1-9]\d{7,14}$/;

export const ExportFormat = {
  CSV: "csv",
  EXCEL: "excel",
};

export const Currencies = {
  USD: "USD",
  MXN: "MXN",
  USDT: "USDT",
};

export const SupportedCrypto = {
  BTC: "btc",
  ETH: "eth",
};

export const LogTypes = {
  REQUEST: "Request",
  ERROR: "Error",
  ACTION: "Action",
  INFO: "Info",
};

export const AccessRole = {
  SYSTEM: "system",
  ADMIN: "admin",
  SALES_REP: "sales_rep",
  INVESTOR: "investor",
};

export const UserStatus = {
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
  BLOCKED: "blocked",
  ARCHIVED: "archived",
};

export const LogActions = {
  INIT: "Init",
  CREATE: "Create",
  UPDATE: "Update",
  SOFT_DELETE: "Soft Delete",
  HARD_DELETE: "Hard Delete",
  RESTORE: "Restore",
  FAILURE: "Failure",
  FETCH: "Fetch",
};

export const VerificationType = {
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RECOVERY: "password_recovery",
};

export const EmailSubject = {
  EMAIL_VERIFICATION: "Email Verification",
  PASSWORD_RECOVERY: "Password Recovery",
};

export const UserNotificationStatus = {
  L1: "L1",
  L2: "L2",
  L3: "L3",
  L4: "L4",
  L5: "L5",
  OFF: "Off",
};

export const ConfigType = {
  BOOLEAN: "boolean",
  INTEGER: "integer",
  DOUBLE: "double",
  STRING: "string",
  JSON: "json",
};

export const NotificationType = {
  INFO: "Info",
  WARNING: "Warning",
  SUCCESS: "Success",
  ALERT: "Alert",
};

export const NotificationCategory = {
  INFO: "Info",
};

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export const EmailType = {
  PASSWORD_RECOVERY: "passwordRecovery",
  EMAIL_VERIFICATION: "verification",
  SUBSCRIPTION_RENEWED: "renewed",
};

export const CartStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed",
};

export const PaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PayementMethod = {
  STRIPE: "stripe",
  CRYPTO: "crypto",
  WIRE: "wire",
  TRUST_WALLET: "trust_wallet",
};

export const PaymentAccountType = {
  STRIPE: "stripe",
  CRYPTO: "crypto",
  BANK: "bank",
};

export const AdminApprovalStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const PromoCodeStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
  USED: "used",
};
