import { NextFunction, Request, Response } from "express";
import { JSON } from "../types/utility.types";

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
}): [Request, Response, NextFunction] => {
  const send = jest.fn();
  const json = jest.fn();

  return [
    {
      params,
      query,
      body,
    } as unknown as Request<ParamsType, unknown, BodyType, QueryType>,
    {
      status: jest.fn().mockImplementation(() => ({
        send,
        json,
      })),
      send,
      json,
    } as unknown as Response<void>,
    jest.fn() as unknown as NextFunction,
  ];
};
