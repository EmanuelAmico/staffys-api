import { NextFunction, Request, Response } from "express";
import { checkProperties } from "../utils/checkreq.utils";
import {
  GetOrCreateFormRequestBody,
  GetOrCreateFormResponse,
} from "../types/form.types";
import { FormService } from "../services/form.service";

class FormController {
  static async getOrCreateTodayForm(
    req: Request<
      Record<string, never>,
      GetOrCreateFormResponse,
      GetOrCreateFormRequestBody,
      Record<string, never>
    >,
    res: Response<GetOrCreateFormResponse>,
    next: NextFunction
  ) {
    try {
      checkProperties(req.body, [
        { field: "userId", type: "string" },
        { field: "hasDrank", type: "boolean" },
        { field: "hasPsychotropicDrugs", type: "boolean" },
        { field: "hasEmotionalProblems", type: "boolean" },
      ]);

      const { userId, hasDrank, hasPsychotropicDrugs, hasEmotionalProblems } =
        req.body;

      const form = await FormService.getOrCreateTodayForm(
        userId,
        hasDrank,
        hasPsychotropicDrugs,
        hasEmotionalProblems
      );

      res.status(200).send({
        status: 200,
        message: "Form retrieved successfully",
        data: form,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { FormController };
