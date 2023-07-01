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
  const passwordRegex = /^(?=.*\d).{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must have at least one uppercase letter and a minimum length of 6 characters"
    );
  }
};

const checkTypes = (
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
  const incorrectProperties: Record<string, string> = {}; // Objeto para almacenar las propiedades incorrectas y sus tipos esperados

  allowedParameters.forEach((key, index) => {
    const type = allowedTypes[index];
    const value = object[key];

    if (type === null && value === null) {
      return;
    }

    if (type === Types.ObjectId && typeof value === "string") {
      if (!Types.ObjectId.isValid(value)) {
        incorrectProperties[key] = "ObjectId";
      }
      return;
    }

    if (type === "password" && typeof value === "string") {
      return checkPassword(value);
    }

    if (typeof value !== type) {
      incorrectProperties[key] = type as string;
    }
  });

  if (Object.keys(incorrectProperties).length > 0) {
    throw new Error(
      "Properties with incorrect types: " + JSON.stringify(incorrectProperties)
    );
  }
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

export const checkProperties = <
  T extends Record<keyof T, string | number | boolean | null | undefined>
>(
  object: T,
  params: IParameter[]
) => {
  const allowedParameters = params.map(({ field }) => field);
  const allowedTypes = params.map(({ type }) => type);
  checkRequiredParameters(object, allowedParameters);
  checkTypes(object, allowedParameters, allowedTypes);
};
