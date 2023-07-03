import { Document, model, Schema, Types } from "mongoose";

export interface Form extends Document {
  _id: Types.ObjectId;
  date: Date;
  user: Schema.Types.ObjectId;
  hasDrank: boolean;
  hasPsychotropicDrugs: boolean;
  hasEmotionalProblems: boolean;
}

const FormSchema = new Schema<Form>({
  date: {
    type: Date,
    required: true,
    unique: true,
    validate: {
      validator: function (value: Date) {
        const currentDate = new Date();
        return value >= currentDate;
      },
      message: "The date cannot be earlier than the current date",
    },
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

export const Form = model<Form>("Form", FormSchema);