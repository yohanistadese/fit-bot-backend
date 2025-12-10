import { AccessRole } from "../utilities/constant/Constants";

export const DB_TYPES = {
  MYSQL: "mysql",
  POSTGRES: "postgres",
};

export const isProduction = process.env.PRODUCTION === "true";

const getDBType = (type?: string) => {
  if (type) {
    if (Object.values(DB_TYPES).indexOf(type) !== -1) return type;
  }
  return DB_TYPES.POSTGRES;
};

export const env: any = {
  // Application Settings
  PORT: process.env.PORT || 3000,
  PRODUCTION: process.env.PRODUCTION === "true",

  //Stripe
  STRIPE_SECRET_KEY: isProduction
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST_MODE,

  //Now payment
  NOWPAYMENTS_API_KEY: isProduction
    ? process.env.NOWPAYMENTS_API_KEY
    : process.env.NOWPAYMENTS_TEST_API_KEY,

  // Auth
  AUTH_KEY: process.env.AUTH_KEY,
  AUTH_KEY_EXPIRY: process.env.AUTH_KEY_EXPIRY,
  VERIFICATION_EXPIRY: process.env.VERIFICATION_EXPIRY,
  RECOVERY_EXPIRY: process.env.RECOVERY_EXPIRY,
  OTP_EXPIRY_TIME: process.env.OTP_EXPIRY_TIME,

  // Database
  DB_TYPE: isProduction ? process.env.DB_TYPE : process.env.DEV_DB_TYPE,
  DB_HOST: isProduction ? process.env.DB_HOST : process.env.DEV_DB_HOST,
  DB_PORT: Number(isProduction ? process.env.DB_PORT : process.env.DEV_DB_PORT),
  DB_USERNAME: isProduction
    ? process.env.DB_USERNAME
    : process.env.DEV_DB_USERNAME,
  DB_PASSWORD: isProduction
    ? process.env.DB_PASSWORD
    : process.env.DEV_DB_PASSWORD,
  DB_NAME: isProduction ? process.env.DB_NAME : process.env.DEV_DB_NAME,

  DB_SSL_ENABLED: isProduction || process.env.DB_SSL_ENABLED === "true",

  // Company
  COMPANY_NAME: process.env.COMPANY_NAME || "Fit Bot",
  COMPANY_EMAIL: process.env.SMTP_USER || "support@fitbot.ai",

  // Email
  SMTP_HOST: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  SMTP_PORT: process.env.SMTP_PORT || "587",
  SMTP_USER: process.env.SMTP_USER || "test",
  SMTP_PASS: process.env.SMTP_PASS || "password",

  // Swagger
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED === "true",

  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,

  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  FRONTEND_ADMIN_URL: process.env.FRONTEND_ADMIN_URL,
};

export const constants: any = {
  SYSTEM_CONFIG_KEY: "System Init",
  SYSTEM_CONFIG_TYPE: "string",
  SYSTEM_CONFIG_VALUE: "True",
  BASE_FIRST_NAME: "Boingo",
  BASE_LAST_NAME: "Super Admin",
  BASE_PHONE_NUMBER: "251930538714",
  BASE_ROLE_ID: "e48f7ed1-db16-4511-be6a-87ef32aab99d",
  DEFAULT_USER_ID: "e48f7ed1-db16-4611-be3a-87ef32aab99d",
  BASE_ROLE: AccessRole.SYSTEM,
  BASE_EMAIL: "boingoaisuperadmin@gmail.com",
  BASE_PASSWORD: "1q2w3e4sr5t6ey7u8i9o0p",

  BROKER_ROLE: "Broker Role",
  USER_ROLE: "User Role",

  SUPER_ADMIN_ROLE_ID: "e48f7ed1-db16-4511-be6a-87ef32aab99d",
  ADMIN_ROLE_ID: "8edbc138-affb-476f-8917-0d5b66e26a50",
  PRESALE_LISTING_TYPE_ID: "1fa97590-2d11-46fb-85a2-30e4d966d729",
};

export const UploadConstants = {
  MimeTypes: ["image/png", "image/jpeg", "image/jpg"],
  MAX_SIZE: 30 * 1024 * 1024, // 30 MB
  MIN_DIMENSIONS: { width: 1024, height: 768 },
  MIN_DISPLAYABLE: { width: 330, height: 220 },
  MAX_DIMENSIONS: { width: 2048, height: 1536 },
};
