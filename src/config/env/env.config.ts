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
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  TESTING_PORT: process.env.TESTING_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  BACKOFFICE_CLIENT_HOST: process.env.BACKOFFICE_CLIENT_HOST,
  DELIVERY_CLIENT_HOST: process.env.DELIVERY_CLIENT_HOST,
};
