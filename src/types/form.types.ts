import { Types } from "mongoose";

export interface Form {
  _id: Types.ObjectId;
  date: Date;
  user: Types.ObjectId;
  hasDrank: boolean;
  hasPsychotropicDrugs: boolean;
  hasEmotionalProblems: boolean;
}
