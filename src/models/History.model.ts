import { model, Schema, Types } from "mongoose";

export interface History extends Document {
  _id: Types.ObjectId;
  date: Date;
  activeUsers: Types.ObjectId[];
  targetPackages: Types.ObjectId[];
  deliveredPackages: Types.ObjectId[];
}

const HistorySchema = new Schema<History>({
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

export const History = model<History>("History", HistorySchema);
