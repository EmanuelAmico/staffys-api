import { Types } from "mongoose";
interface IParameter {
  field: string;
  type: string | null | undefined | unknown | Types.ObjectId;
}
const checkNotAllowedParameters = (
  object: Record<
    string,
    object | string | number | boolean | null | undefined | unknown
  >,
  allowedParameters: string[],
  allowedTypes: (string | number | boolean | null | undefined | unknown)[]
) => {
  const incorrectProperties = allowedParameters.filter((key, index) => {
    const type = allowedTypes[index];
    const value = object[key];
    if (type === Types.ObjectId) {
      if (!Types.ObjectId.isValid(value as string)) {
        throw new Error("el id no es un Object Id");
      }
      return false;
    }

    return typeof value !== type;
  });

  if (incorrectProperties.length > 0) {
    throw new Error(
      "Properties with incorrect types:" + incorrectProperties.join(",")
    );
  }
  return;
};
const checkRequiredParameters = (
  object: Record<
    string,
    object | string | number | boolean | null | undefined | unknown
  >,
  allowedParameters: string[]
) => {
  const missingParameters = allowedParameters.filter(
    (key) => !(key in object) || object[key] == null || object[key] === ""
  );
  if (missingParameters.length > 0) {
    throw new Error(
      "This fields are required also:" + missingParameters.join(",")
    );
  }
  const extraProperties = Object.keys(object).filter(
    (key) => !allowedParameters.includes(key)
  );

  if (extraProperties.length > 0) {
    throw new Error(
      "Extra properties not allowed: " + extraProperties.join(",")
    );
  }

  return;
};
const checkPassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z]).{6,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must have at least one uppercase letter and a minimum length of 6 characters"
    );
  }
};

export const checkProperties = (
  object: Record<
    string,
    object | string | number | boolean | null | undefined | unknown
  >,

  params: IParameter[]
) => {
  const allowedParameters = params.map(({ field }) => field);
  const allowedTypes = params.map(({ type }) => type);
  checkRequiredParameters(object, allowedParameters);
  checkNotAllowedParameters(object, allowedParameters, allowedTypes);
  if (object.password && typeof object.password === "string") {
    checkPassword(object.password);
  }
};
