import { Document, model, Schema } from "mongoose";

export interface HistoryProps extends Document {
  date: Date;
  activeUsers: Schema.Types.ObjectId[];
  targetPackages: Schema.Types.ObjectId[];
}

const historySchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  activeUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  targetPackages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Packages",
      required: true,
    },
  ],
});

export default model<HistoryProps>("History", historySchema);
