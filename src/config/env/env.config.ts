export const envsValidation = () => {
  if (
    !process.env.PORT ||
    !process.env.JWT_SECRET ||
    !process.env.DELIVERY_CLIENT_HOST ||
    !process.env.BACKOFFICE_CLIENT_HOST
  ) {
    throw new Error("The proyect must contains the envs!");
  }
};
