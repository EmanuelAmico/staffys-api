/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

import { NextFunction, Request, Response } from "express";

// TODO Remove "_" from unused parameters
class UserController {
  static createUser(_req: Request, _res: Response, _next: NextFunction) {}

  static getUserById(_req: Request, _res: Response, _next: NextFunction) {}

  static getDeliveryPeople(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) {}

  static updateUserById(_req: Request, _res: Response, _next: NextFunction) {}

  static deleteUserById(_req: Request, _res: Response, _next: NextFunction) {}

  static takePackage(_req: Request, _res: Response, _next: NextFunction) {}

  static startDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static finishDelivery(_req: Request, _res: Response, _next: NextFunction) {}

  static cancelDelivery(_req: Request, _res: Response, _next: NextFunction) {}
}

export { UserController };