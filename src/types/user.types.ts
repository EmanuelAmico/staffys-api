import { Types } from "mongoose";
import { User } from "../models/User.model";

export interface UserResponse {
  message: string;
  status: number;
  data: {
    user?: Omit<User, "password" | "salt"> | null | string;
    token?: string | null;
    findUser?: Omit<User, "password" | "salt"> | null;
    users?: Omit<User, "password" | "salt">[];
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
