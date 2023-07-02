import mongoose from "mongoose";
import History from "../../models/History.model";
import { envs } from "../../config/env/env.config";

const { MONGO_URI } = envs;

describe("History Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await History.deleteMany({});
  });

  describe("History Model", () => {
    it("guarda un día correctamente", async () => {
      const newDay = new History({
        date: "16/02/23",
      });

      const savedDay = await newDay.save();
      //console.log(savedDay);
      expect(savedDay._id).toBeDefined();
      expect(savedDay.date).toBe("16/02/23");
    });
  });
});
