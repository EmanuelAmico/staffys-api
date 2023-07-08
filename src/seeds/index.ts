import mongoose from "mongoose";
import Package from "../models/Package.model";
import User from "../models/User.model";
import { envs } from "../config/env/env.config";
import { users, packages } from "./fakeData";
const { MONGO_URI } = envs;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await User.create(users);
    await Package.create(packages);
    // eslint-disable-next-line no-console
    console.log("successful seeding");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("there was an error trying to seed:", error);
    process.exit(1);
  }
})();
