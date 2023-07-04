import { Schema, Types } from "mongoose";
import { ResponseBody } from "./request.types";
export interface User {
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
  pendingPackages?: Schema.Types.ObjectId[];
  currentPackage?: Schema.Types.ObjectId;
  historyPackages?: Schema.Types.ObjectId[];
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
export interface ExtendedUserRequestBody extends RegisterRequestBody {
  _id: Types.ObjectId;
}

export type RegisterResponse = ResponseBody<{
  user: User;
  token: string;
} | null>;

export type LoginResponse = ResponseBody<{
  user: User;
  token: string;
} | null>;

export type GetDeliveryPeopleResponse = ResponseBody<{
  users: User[];
} | null>;

export type UpdateUserByIdResponse = ResponseBody<{
  findUser: User;
} | null>;
