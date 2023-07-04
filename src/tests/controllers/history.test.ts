import { HistoryController } from "../../controllers/history.controller";
import { HistoryService } from "../../services/history.service";
import { mockControllerParams } from "../../utils/testing.utils";

describe.skip("History Controller", () => {
  describe("Method -> getHistoryByDate", () => {
    beforeAll(() => {
      jest.mock("../../services/history.service", () => ({
        HistoryService: {
          resetPassword: jest.fn(),
        },
      }));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("if req.body.date is invalid, it should respond with status 400, message 'date is invalid' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          date: "invalidDate",
        },
      }) as unknown as Parameters<typeof HistoryController.getHistoryByDate>;

      expect.assertions(4);

      await expect(
        HistoryController.getHistoryByDate(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(HistoryService.getHistoryByDate).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "date is invalid",
        data: null,
        status: 400,
      });
    });

    it("if req.body.date is valid but is in the future, it should respond with status 400, message 'date is invalid for being in the future' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        },
      }) as unknown as Parameters<typeof HistoryController.getHistoryByDate>;

      expect.assertions(4);

      await expect(
        HistoryController.getHistoryByDate(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(HistoryService.getHistoryByDate).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "date is invalid for being in the future",
        data: null,
        status: 400,
      });
    });

    it("if req.body.date is valid and is in the past, it should respond with status 200, message 'history found' and data: history (has to be defined)", async () => {
      const date = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          date,
        },
      }) as unknown as Parameters<typeof HistoryController.getHistoryByDate>;

      expect.assertions(4);

      await expect(
        HistoryController.getHistoryByDate(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(HistoryService.getHistoryByDate).toHaveBeenCalledWith(date);
      expect(mockedRes.status).toHaveBeenCalledWith(200);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "History found",
        data: expect.anything(),
        status: 200,
      });
    });
  });
});
