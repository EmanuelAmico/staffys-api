import { ResponseBody } from "./request.types";
import { HistoryService } from "../services";
import { History } from "../models/History.model";

export type GetHistoryByDateRequestParams = {
  date: string;
};

export interface CreateHistoryRequestBody {
  date: string;
}

export type GetHistoryByDateResponse = ResponseBody<
  Awaited<ReturnType<typeof HistoryService.getHistoryByDate>>
>;
export type CreateHistory = ResponseBody<
  Awaited<ReturnType<typeof HistoryService.createHistory>>
>;
export type GetOrCreateTodayHistoryResponse = ResponseBody<History>;
export type GetAllHistoriesResponse = ResponseBody<History[]>;
