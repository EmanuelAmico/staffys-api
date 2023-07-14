import { ResponseBody } from "./request.types";
import { FormService } from "../services/form.service";

export type GetFormResponse = ResponseBody<
  Awaited<ReturnType<typeof FormService.getTodayForm>>
>;
export type GetOrCreateFormResponse = ResponseBody<
  Awaited<ReturnType<typeof FormService.getOrCreateTodayForm>>
>;

export interface GetOrCreateFormRequestBody {
  userId: string;
  hasDrank: boolean;
  hasPsychotropicDrugs: boolean;
  hasEmotionalProblems: boolean;
}
