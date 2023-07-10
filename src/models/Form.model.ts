import { Document, model, Schema, Types } from "mongoose";

export interface Form {
  _id: Types.ObjectId;
  date: Date;
  user: Types.ObjectId;
  hasDrank: boolean;
  hasPsychotropicDrugs: boolean;
  hasEmotionalProblems: boolean;
}

export interface FormModelProps extends Form, Document {
  _id: Types.ObjectId;
}

const FormSchema = new Schema<Form>({
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  hasDrank: {
    type: Boolean,
    required: true,
  },
  hasPsychotropicDrugs: {
    type: Boolean,
    required: true,
  },
  hasEmotionalProblems: {
    type: Boolean,
    required: true,
  },
});

const Form = model<Form>("Form", FormSchema);

export { Form };
