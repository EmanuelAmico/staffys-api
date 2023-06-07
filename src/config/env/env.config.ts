export const envsValidation = () => {
  if (!process.env.PORT || !process.env.JWT_SECRET) {
    throw new Error("The proyect must contains the envs!");
  }
};
