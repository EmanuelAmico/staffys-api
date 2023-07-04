import { Types } from "mongoose";
import { APIError } from "./error.utils";

interface Parameter {
  field: string;
  type:
    | "string"
    | "boolean"
    | "number"
    | "password"
    | "email"
    | null
    | undefined
    | typeof Types.ObjectId
    | Types.ObjectId
    | Date;
}

const checkPassword = (password: string) => {
  const passwordRegex = /^(?=.*\d).{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new APIError({
      message:
        "Password must have at least one uppercase letter and a minimum length of 8 characters",
      status: 400,
    });
  }
};

const checkEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new APIError({ message: "Email must be a valid email", status: 400 });
  }
};

const checkTypes = (
  object: Record<
    string,
    object | string | number | boolean | null | undefined | Date
  >,
  allowedParameters: string[],
  allowedTypes: (
    | "string"
    | "boolean"
    | "number"
    | "password"
    | "email"
    | null
    | undefined
    | typeof Types.ObjectId
    | Types.ObjectId
    | Date
  )[]
) => {
  const incorrectProperties: Record<string, string> = {};

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

    if (type === "email" && typeof value === "string") {
      return checkEmail(value);
    }

    if (typeof value !== type) {
      incorrectProperties[key] = type as string;
    }
  });

  if (Object.keys(incorrectProperties).length > 0) {
    throw new APIError({
      message:
        "Properties with incorrect types: " +
        JSON.stringify(incorrectProperties),
      status: 400,
    });
  }
};

const checkRequiredParameters = (
  object: Record<
    string,
    object | string | number | boolean | null | undefined | unknown | Date
  >,
  allowedParameters: string[],
  optionalParameters?: string[]
) => {
  const missingParameters = allowedParameters.filter(
    (key) => !(key in object) || object[key] === undefined
  );

  const missingParametersFinal = missingParameters.filter(
    (key) => !(key in object)
  );

  if (missingParametersFinal.length > 0) {
    throw new APIError({
      message: "These fields are required:" + missingParameters.join(","),
      status: 400,
    });
  }
  if (optionalParameters) {
    const extraProperties = Object.keys(object).filter(
      (key) =>
        !allowedParameters.includes(key) && !optionalParameters.includes(key)
    );

    if (extraProperties.length > 0) {
      throw new APIError({
        message: "Extra properties not allowed: " + extraProperties.join(","),
        status: 400,
      });
    }
  } else {
    const extraProperties = Object.keys(object).filter(
      (key) => !allowedParameters.includes(key)
    );

    if (extraProperties.length > 0) {
      throw new APIError({
        message: "Extra properties not allowed: " + extraProperties.join(","),
        status: 400,
      });
    }
  }

  return;
};

export const checkProperties = <
  T extends Partial<
    Record<
      keyof T,
      | string
      | number
      | boolean
      | null
      | undefined
      | typeof Types.ObjectId
      | Types.ObjectId
      | Date
    >
  >
>(
  object: T,
  params: Parameter[],
  optionalFields?: Parameter[]
) => {
  const allowedParameters = params.map(({ field }) => field);
  const allowedTypes = params.map(({ type }) => type);
  if (optionalFields) {
    const OptionalParameters = optionalFields.map(({ field }) => field);
    checkRequiredParameters(object, allowedParameters, OptionalParameters);

    const optionalFieldsFiltered = optionalFields.filter(
      ({ field }) => field in object
    );

    const optionalParametersfiltered = optionalFieldsFiltered.map(
      ({ field }) => field
    );
    const optionalTypesfiltered = optionalFieldsFiltered.map(
      ({ type }) => type
    );
    checkTypes(object, allowedParameters, allowedTypes);
    checkTypes(object, optionalParametersfiltered, optionalTypesfiltered);
  } else {
    checkRequiredParameters(object, allowedParameters);
    checkTypes(object, allowedParameters, allowedTypes);
  }
};
