import { model, Schema } from "mongoose";
import { History } from "../types/history.types";

export interface HistoryModelProps extends History, Document {}

const HistorySchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const History = model<HistoryModelProps>("History", HistorySchema);

export default History;
