import { Document, model, Schema } from "mongoose";

export interface FromModelProps extends Document {
  date: Date;
  responses: [
    {
      user: Schema.Types.ObjectId;
      hasDrank: boolean;
      hasPsychotropicDrugs: boolean;
      hasEmotionalProblems: boolean;
    }
  ];
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
  responses: [
    {
      user: [
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
    },
  ],
});

export default model<FromModelProps>("Form", FormSchema);
