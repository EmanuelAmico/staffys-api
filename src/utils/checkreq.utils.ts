import { Types } from "mongoose";

interface IParameter {
  field: string;
  type:
    | "string"
    | "boolean"
    | "number"
    | "password"
    | null
    | undefined
    | typeof Types.ObjectId;
}

const checkPassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z]).{6,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must have at least one uppercase letter and a minimum length of 6 characters"
    );
  }
};

const checkNotAllowedParameters = (
  object: Record<string, object | string | number | boolean | null | undefined>,
  allowedParameters: string[],
  allowedTypes: (
    | "string"
    | "boolean"
    | "number"
    | "password"
    | null
    | undefined
    | typeof Types.ObjectId
  )[]
) => {
  const incorrectProperties = allowedParameters.filter((key, index) => {
    const type = allowedTypes[index];
    const value = object[key];

    if (type === null && value === null) {
      return false;
    }

    if (type === Types.ObjectId && typeof value === "string") {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error("the id is not an ObjectId");
      }
      return false;
    }

    if (type === "password" && typeof value === "string") {
      return checkPassword(value);
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
    (key) => !(key in object) || object[key] === undefined
  );
  if (missingParameters.length > 0) {
    throw new Error("This fields are required:" + missingParameters.join(","));
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

export const checkProperties = (
  object: Record<string, object | string | number | boolean | null | undefined>,
  params: IParameter[]
) => {
  const allowedParameters = params.map(({ field }) => field);
  const allowedTypes = params.map(({ type }) => type);
  checkRequiredParameters(object, allowedParameters);
  checkNotAllowedParameters(object, allowedParameters, allowedTypes);
};
