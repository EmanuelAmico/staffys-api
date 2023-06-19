import { NextFunction, Request, Response } from "express";
import { JSON } from "../types/utility.types";

export const mockControllerParams = ({
  params = {},
  query = {},
  body = {},
}: {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: JSON;
}): [Request, Response, NextFunction] => {
  const send = jest.fn();
  const json = jest.fn();

  return [
    {
      params,
      query,
      body,
    } as unknown as Request,
    {
      status: jest.fn().mockImplementation(() => ({
        send,
        json,
      })),
      send,
      json,
    } as unknown as Response,
    jest.fn() as unknown as NextFunction,
  ];
};
