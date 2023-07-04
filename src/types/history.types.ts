import { Types } from "mongoose";
import { ResponseBody } from "./request.types";
import { HistoryService } from "../services";

export interface History {
  _id: Types.ObjectId;
  date: Date;
  activeUsers: Types.ObjectId[];
  targetPackages: Types.ObjectId[];
}

export interface GetHistoryByDateRequestBody {
  date: string;
}

export type GetHistoryByDateResponse = ResponseBody<
  Awaited<ReturnType<typeof HistoryService.getHistoryByDate>>
>;
