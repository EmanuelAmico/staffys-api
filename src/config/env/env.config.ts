export const envsValidation = () => {
  if (
    !process.env.NODE_ENV ||
    !process.env.PORT ||
    !process.env.TESTING_PORT ||
    !process.env.JWT_SECRET ||
    !process.env.MONGO_URI ||
    !process.env.BACKOFFICE_CLIENT_HOST ||
    !process.env.DELIVERY_CLIENT_HOST
  ) {
    throw new Error("The proyect must contains the envs!");
  }
};

export const envs = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  testingPort: process.env.TESTING_PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  backofficeClientPort: process.env.BACKOFFICE_CLIENT_HOST,
  deliveryClientPort: process.env.DELIVERY_CLIENT_HOST,
};
