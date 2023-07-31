const envList = [
  "NODE_ENV",
  "PORT",
  "TESTING_PORT",
  "JWT_SECRET",
  "MONGO_URI",
  "DELIVERY_CLIENT_HOST",
  "BACKOFFICE_CLIENT_HOST",
  "DELIVERY_CLIENT_HOST_LOCAL",
  "BACKOFFICE_CLIENT_HOST_LOCAL",
  "GOOGLE_API_KEY",
  "OAUTH2_EMAIL",
  "OAUTH2_CLIENT_ID",
  "OAUTH2_CLIENT_SECRET",
  "OAUTH2_REFRESH_TOKEN",
  "AWS_BUCKET_NAME",
  "AWS_BUCKET_REGION",
  "AWS_S3_PUBLIC_KEY",
  "AWS_S3_SECRET_KEY",
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
    !process.env.BACKOFFICE_CLIENT_HOST_LOCAL ||
    !process.env.DELIVERY_CLIENT_HOST_LOCAL ||
    !process.env.AWS_BUCKET_NAME ||
    !process.env.AWS_BUCKET_REGION ||
    !process.env.AWS_S3_PUBLIC_KEY ||
    !process.env.AWS_S3_SECRET_KEY
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
    DELIVERY_CLIENT_HOST: process.env.DELIVERY_CLIENT_HOST,
    BACKOFFICE_CLIENT_HOST: process.env.BACKOFFICE_CLIENT_HOST,
    DELIVERY_CLIENT_HOST_LOCAL: process.env.DELIVERY_CLIENT_HOST_LOCAL,
    BACKOFFICE_CLIENT_HOST_LOCAL: process.env.BACKOFFICE_CLIENT_HOST_LOCAL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    OAUTH2_EMAIL: process.env.OAUTH2_EMAIL,
    OAUTH2_CLIENT_ID: process.env.OAUTH2_CLIENT_ID,
    OAUTH2_CLIENT_SECRET: process.env.OAUTH2_CLIENT_SECRET,
    OAUTH2_REFRESH_TOKEN: process.env.OAUTH2_REFRESH_TOKEN,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
    AWS_S3_PUBLIC_KEY: process.env.AWS_S3_PUBLIC_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  } as const;
})();
