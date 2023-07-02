import { Document, model, Schema } from "mongoose";

export interface FromProps extends Document {
  date: Date;
  users: Schema.Types.ObjectId;
  hasDrank: boolean;
  hasPsychotropicDrugs: boolean;
  hasEmotionalProblems: boolean;
}

const FormSchema = new Schema({
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
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
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

export default model<FromProps>("Form", FormSchema);
