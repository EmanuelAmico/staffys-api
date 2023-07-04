import { model, Schema, Types } from "mongoose";
import { History } from "../types/history.types";

export interface HistoryModelProps extends History, Document {
  _id: Types.ObjectId;
}

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
        default: [],
      },
    ],
    targetPackages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Packages",
        required: true,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const History = model<History>("History", HistorySchema);

export default History;
