import { Types } from "mongoose";
import { APIError } from "./error.utils";

interface IParameter {
  field: string;
  type:
    | "string"
    | "boolean"
    | "number"
    | "password"
    | null
    | undefined
    | typeof Types.ObjectId
    | Types.ObjectId;
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
    | Types.ObjectId
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
    object | string | number | boolean | null | undefined | unknown
  >,

  allowedParameters: string[],
  optional: boolean
) => {
  if (!optional) {
    const missingParameters = allowedParameters.filter(
      (key) => !(key in object) || object[key] === undefined
    );
    if (missingParameters.length > 0) {
      throw new APIError({
        message: "This fields are required:" + missingParameters.join(","),
        status: 400,
      });
    }
  }

  const extraProperties = Object.keys(object).filter(
    (key) => !allowedParameters.includes(key)
  );

  if (extraProperties.length > 0) {
    throw new APIError({
      message: "Extra properties not allowed: " + extraProperties.join(","),
      status: 400,
    });
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
    >
  >
>(
  object: T,
  params: IParameter[],
  optionalFields?: IParameter[]
) => {
  const allowedParameters = params.map(({ field }) => field);
  const allowedTypes = params.map(({ type }) => type);
  if (optionalFields) {
    if (!("_id" in object)) {
      throw new APIError({
        message: "id must be provided",
        status: 400,
      });
    }
    const OptionalParameters = optionalFields.map(({ field }) => field);
    checkRequiredParameters(object, OptionalParameters, true);

    const optionalFieldsFiltered = optionalFields.filter(
      ({ field }) => field in object
    );

    const optionalParametersfiltered = optionalFieldsFiltered.map(
      ({ field }) => field
    );
    const optionalTypesfiltered = optionalFieldsFiltered.map(
      ({ type }) => type
    );
    checkTypes(object, optionalParametersfiltered, optionalTypesfiltered);
  } else {
    checkRequiredParameters(object, allowedParameters, false);
    checkTypes(object, allowedParameters, allowedTypes);
  }
};
