export const DB_TYPES = {
  MYSQL: "mysql",
  POSTGRES: "postgres",
};

export const isProduction = process.env.PRODUCTION === "true";
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
  BASE_NAME: "Fit Bot",
};

export const UploadConstants = {
  MimeTypes: ["image/png", "image/jpeg", "image/jpg"],
  MAX_SIZE: 30 * 1024 * 1024, // 30 MB
  MIN_DIMENSIONS: { width: 1024, height: 768 },
  MIN_DISPLAYABLE: { width: 330, height: 220 },
  MAX_DIMENSIONS: { width: 2048, height: 1536 },
};
