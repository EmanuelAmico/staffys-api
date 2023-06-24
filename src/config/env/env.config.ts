const envList = [
  "NODE_ENV",
  "PORT",
  "TESTING_PORT",
  "JWT_SECRET",
  "MONGO_URI",
  "BACKOFFICE_CLIENT_HOST",
  "DELIVERY_CLIENT_HOST",
  "MONGO_URI_TESTING",
];
export const envs = (() => {
  if (
    !process.env.NODE_ENV ||
    !process.env.PORT ||
    !process.env.TESTING_PORT ||
    !process.env.JWT_SECRET ||
    !process.env.MONGO_URI ||
    !process.env.MONGO_URI_TESTING ||
    !process.env.BACKOFFICE_CLIENT_HOST ||
    !process.env.DELIVERY_CLIENT_HOST
  ) {
    const missingEnvs: string[] = [];

    envList.forEach((element) => {
      if (!process.env[element]) missingEnvs.push(element);
    });

    throw new Error(
      `The project must contains all the envs. The missing envs are: ${missingEnvs.join(
        ", "
      )}.`
    );
  }
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    TESTING_PORT: process.env.TESTING_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_URI_TESTING: process.env.MONGO_URI_TESTING,
    BACKOFFICE_CLIENT_HOST: process.env.BACKOFFICE_CLIENT_HOST,
    DELIVERY_CLIENT_HOST: process.env.DELIVERY_CLIENT_HOST,
  };
})() as Record<string, string>;
