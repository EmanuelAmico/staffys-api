import { NextFunction, Request, Response } from "express";
import { JSON } from "../types/utility.types";
import { ResponseBody } from "../types/request.types";
import { APIError } from "./error.utils";

export const mockControllerParams = <
  ParamsType extends Record<string, string> = Record<string, never>,
  QueryType extends Record<string, string> = Record<string, never>,
  BodyType extends JSON = Record<string, never>
>({
  params = {} as ParamsType,
  query = {} as QueryType,
  body = {} as BodyType,
}: {
  params?: ParamsType;
  query?: QueryType;
  body?: BodyType;
}): [
  Request<ParamsType, ResponseBody, BodyType, QueryType>,
  Response<ResponseBody>,
  NextFunction
] => {
  const send = jest.fn();
  const json = jest.fn();
  const status = jest.fn().mockImplementation(() => ({
    send,
    json,
  }));

  return [
    {
      params,
      query,
      body,
    } as unknown as Request<ParamsType, ResponseBody, BodyType, QueryType>,
    {
      status,
      send,
      json,
    } as unknown as Response<ResponseBody>,
    jest.fn().mockImplementation((error: APIError) => {
      status(error.status).send({
        status: error.status,
        message: error.message,
        data: null,
      });
    }) as unknown as NextFunction,
  ];
};
