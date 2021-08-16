require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  publicKey: process.env.PUBLIC_KEY_PATH,
  privateKey: process.env.PRIVATE_KEY_PATH,
  dsnSentryUrl: process.env.DSN_SENTRY_URL,
  mongoDbAuth: process.env.MONGODB_GATEWAY_URL,
  mongoDbTransaction: process.env.MONGODB_TRANSACTION_URL,
  mongoDbAddition: process.env.MONGODB_ADDITION_URL,
  mongoDbPartnerAccount: process.env.MONGODB_PARTNER_ACCOUNT_URL,
  mongoDbContent: process.env.MONGO_CONTENT_DB_URL,
  minioConfig: {
    endPoint: process.env.MINIO_HOST,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    protocol: process.env.MINIO_PROTOCOL
  },
  usernameAuth: process.env.USERNAME_AUTH,
  passwordAuth: process.env.PASSWORD_AUTH,
  encryptKey: process.env.ENCRYPT_KEY,
  gatewayServiceUrl: process.env.GATEWAY_SERVICE_URL,
  userEmailVerificationPath: process.env.USER_EMAIL_VERIFICATION_PATH,
  partnerServiceUrl: process.env.PARTNER_SERVICE_URL,
  programPath: process.env.PROGRAM_PATH,
  discountPath: process.env.DISCOUNT_PATH,
  packagePath: process.env.PACKAGE_PATH,
  partnerPath: process.env.PARTNER_PATH,
  globalConfigServiceConfig: {
    baseUrl: process.env.PARTNER_SERVICE_URL,
    programPath: process.env.PROGRAM_PATH,
    discountPath: process.env.DISCOUNT_PATH,
    packagePath: process.env.PACKAGE_PATH,
    partnerPath: process.env.PARTNER_PATH,
    walletPath: process.env.WALLET_PATH,
    productCategoryPath: process.env.PRODUCT_CATEGORY_PATH,
    productPath: process.env.PRODUCT_PATH
  },
  voucherManagementServiceConfig: {
    baseUrl: process.env.VOUCHER_MANAGEMENT_SERVICE_URL,
    voucherPath: process.env.VOUCHER_PATH,
    activeVoucherPath: process.env.ACTIVE_VOUCHER_PATH,
    voucherProviderPath: process.env.VOUCHER_PROVIDER_PATH,
    voucherCategoryPath: process.env.VOUCHER_CATEGORY_PATH
  },
  evaServiceConfig: {
    baseUrl: process.env.EVA_BASE_URL,
    authPath: process.env.EVA_AUTH_PATH,
    balancePath: process.env.EVA_BALANCE_PATH,
    transactionHistoryPath: process.env.EVA_TRANSACTION_HISTORY_PATH,
    partnerCode: process.env.EVA_PARTNER_CODE,
    grantType: process.env.EVA_GRANT_TYPE,
    publicKey: process.env.EVA_PUBLIC_KEY,
    privateKey: process.env.EVA_PRIVATE_KEY
  },
  ApmServerUrl: process.env.ELASTIC_APM_SERVER_URL,
  ApmActive: process.env.ELASTIC_APM_ACTIVE
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
