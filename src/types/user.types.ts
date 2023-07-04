import { Types } from "mongoose";
import { ResponseBody } from "./request.types";
import { UserService } from "../services";
export interface User {
  _id: Types.ObjectId;
  name: string;
  lastname: string;
  password: string;
  email: string;
  salt: string;
  is_admin: boolean;
  is_active: boolean;
  urlphoto: string;
  is_deleted: boolean;
  resetToken?: string;
  pendingPackages: Types.ObjectId[];
  currentPackage: Types.ObjectId | null;
  historyPackages: Types.ObjectId[];
}
export interface RegisterRequestBody {
  name: string;
  lastname: string;
  password: string;
  confirmpassword: string;
  email: string;
  urlphoto: string;
}

export interface LoginRequestBody {
  password: string;
  email: string;
}
export interface InitResetPasswordRequestBody {
  email: string;
}

export interface ResetPasswordRequestBody {
  email: string;
  code: number;
  password: string;
  confirmPassword: string;
}

export interface TakePackageRequestBody {
  packageId: string;
  userId: string;
}
export interface StartDeliveryRequestBody {
  userId: string;
}
export interface ExtendedUserRequestBody extends RegisterRequestBody {
  _id: Types.ObjectId;
}

export type RegisterResponse = ResponseBody<{
  user: Omit<User, "password" | "salt">;
  token: string;
} | null>;

export type GetDeliveryPeopleResponse = ResponseBody<{
  users: User[];
} | null>;

export type UpdateUserByIdResponse = ResponseBody<{
  findUser: User;
} | null>;

export type GetUserByIdResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.getUserById>>
>;

export type TakePackageResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.takePackage>>
>;

export type StartDeliveryResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.startDelivery>>
>;

export type CancelDeliveryResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.cancelDelivery>>
>;

export type StartPackageDeliveryResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.startPackageDelivery>>
>;
