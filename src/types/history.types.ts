import { Schema } from "mongoose";

export interface History {
  date: Date;
  activeUsers: Schema.Types.ObjectId[];
  targetPackages: Schema.Types.ObjectId[];
}
