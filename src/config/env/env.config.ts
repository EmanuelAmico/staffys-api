const envList = [
  "NODE_ENV",
  "PORT",
  "TESTING_PORT",
  "JWT_SECRET",
  "MONGO_URI",
  "BACKOFFICE_CLIENT_HOST",
  "DELIVERY_CLIENT_HOST",
  "GOOGLE_API_KEY",
  "OAUTH2_EMAIL",
  "OAUTH2_CLIENT_ID",
  "OAUTH2_CLIENT_SECRET",
  "OAUTH2_REFRESH_TOKEN",
  "OAUTH2_ACCESS_TOKEN",
];
export const envs = (() => {
  if (
    !process.env.NODE_ENV ||
    !process.env.PORT ||
    !process.env.TESTING_PORT ||
    !process.env.JWT_SECRET ||
    !process.env.MONGO_URI ||
    !process.env.BACKOFFICE_CLIENT_HOST ||
    !process.env.DELIVERY_CLIENT_HOST ||
    !process.env.GOOGLE_API_KEY ||
    !process.env.OAUTH2_EMAIL ||
    !process.env.OAUTH2_CLIENT_ID ||
    !process.env.OAUTH2_CLIENT_SECRET ||
    !process.env.OAUTH2_REFRESH_TOKEN ||
    !process.env.OAUTH2_ACCESS_TOKEN
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
    BACKOFFICE_CLIENT_HOST: process.env.BACKOFFICE_CLIENT_HOST,
    DELIVERY_CLIENT_HOST: process.env.DELIVERY_CLIENT_HOST,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    OAUTH2_EMAIL: process.env.OAUTH2_EMAIL,
    OAUTH2_CLIENT_ID: process.env.OAUTH2_CLIENT_ID,
    OAUTH2_CLIENT_SECRET: process.env.OAUTH2_CLIENT_SECRET,
    OAUTH2_REFRESH_TOKEN: process.env.OAUTH2_REFRESH_TOKEN,
    OAUTH2_ACCESS_TOKEN: process.env.OAUTH2_ACCESS_TOKEN,
  } as const;
})();
