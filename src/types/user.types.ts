import { Schema, Types } from "mongoose";

export interface UserProp {
  name: string;
  lastname: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  urlphoto: string;
  pendingPackages?: Schema.Types.ObjectId[];
  currentPackage?: Schema.Types.ObjectId;
  historyPackages?: Schema.Types.ObjectId[];
}

export interface UserResponse {
  message: string;
  status: number;
  data: {
    user?: UserProp | null | string;
    token?: string | null;
    findUser?: UserProp | null;
    users?: UserProp[];
  } | null;
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

export interface ExtendedUserRequestBody extends RegisterRequestBody {
  _id: Types.ObjectId;
}
