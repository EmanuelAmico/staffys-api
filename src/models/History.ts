import { model, Schema } from "mongoose";

export interface HistoryModelProps extends Document {
  date: string;
  activeUsers: Schema.Types.ObjectId[];
  targetPackages: Schema.Types.ObjectId[];
}

const HistorySchema = new Schema({
  date: {
    type: String,
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

const History = model<HistoryModelProps>("History", HistorySchema);

export default History;
