import { ResponseBody } from "./request.types";
import { UserService } from "../services";
import { User } from "../models/User.model";
import { Package } from "../models/Package.model";

export interface PopulatedUser
  extends Omit<User, "pendingPackages" | "currentPackage"> {
  pendingPackages: Package[];
  currentPackage: Package;
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
  userLatitude: string;
  userLongitude: string;
}
export interface StartDeliveryRequestBody {
  userId: string;
}
export interface ExtendedUserRequestBody extends Partial<RegisterRequestBody> {
  _id: string;
  is_able_to_deliver: boolean;
}

export interface FinishPackageDeliveryRequestBody {
  packageId: string;
  userId: string;
}

export type RegisterResponse = ResponseBody<{
  user: Omit<User, "password" | "salt">;
  token: string;
} | null>;

export type LoginResponse = ResponseBody<{
  user: Omit<PopulatedUser, "password" | "salt">;
  token: string;
} | null>;

export type GetDeliveryPeopleResponse = ResponseBody<{
  users: User[];
} | null>;

export type UpdateUserByIdResponse = ResponseBody<{
  findUser: PopulatedUser;
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

export type FinishPackageDeliveryResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.finishPackageDelivery>>
>;

export type DisableUserResponse = ResponseBody<
  Awaited<ReturnType<typeof UserService.disableUser>>
>;

export type MeResponse = ResponseBody<PopulatedUser>;
