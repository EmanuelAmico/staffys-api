import { ResponseBody } from "./request.types";
import { FormService } from "../services/form.service";

export type GetOrCreateFormResponse = ResponseBody<
  Awaited<ReturnType<typeof FormService.getOrCreateTodayForm>>
>;

export interface GetOrCreateFormRequestBody {
  userId: string;
  hasDrank: boolean;
  hasPsychotropicDrugs: boolean;
  hasEmotionalProblems: boolean;
}
