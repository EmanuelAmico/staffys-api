import { History } from "../../models/History.model";
import mongoose from "mongoose";
import { envs } from "../../config/env/env.config";
import { HistoryService } from "../../services/history.service";

const { MONGO_URI } = envs;

describe.skip("History Service", () => {
  describe("Method -> getHistoryByDate", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let history: any;

    beforeAll(async () => {
      await mongoose.connect(MONGO_URI);
      history = await History.create({
        date,
      });
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    afterEach(async () => {
      await History.deleteMany({});
    });

    it("when a valid date is provided, it should return the history document", async () => {
      const findOneSpy = jest.spyOn(History, "findOne");

      expect.assertions(3);

      await expect(HistoryService.getHistoryByDate(date)).resolves.toEqual(
        history
      );
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({ date });
    });
  });
});
