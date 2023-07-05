import { ResponseBody } from "./request.types";
import { HistoryService } from "../services";

export interface GetHistoryByDateRequestBody {
  date: string;
}

export type GetHistoryByDateResponse = ResponseBody<
  Awaited<ReturnType<typeof HistoryService.getHistoryByDate>>
>;
