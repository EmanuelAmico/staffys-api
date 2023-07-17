import { ResponseBody } from "./request.types";
import { HistoryService } from "../services";

export interface GetHistoryByDateRequestBody {
  date: string;
}

export interface CreateHistoryRequestBody {
  date: string;
}

export type GetHistoryByDateResponse = ResponseBody<
  Awaited<ReturnType<typeof HistoryService.getHistoryByDate>>
>;
export type CreateHistory = ResponseBody<
  Awaited<ReturnType<typeof HistoryService.createHistory>>
>;
