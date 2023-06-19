import { UserController } from "../../controllers/user.controller";
import User from "../../models/User";
import { mockControllerParams } from "../../utils/testing.utils";

describe("User Controller", () => {
  describe("Method -> getUserById", () => {
    it("should throw an error if req.params.id is not a posible number and respond with status: 400, error: 'id must be a number' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { id: "not a number, even when parsed" },
      });

      const parseIntSpy = jest.spyOn(Number, "parseInt");

      expect.assertions(7);
      expect(parseIntSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).rejects.toThrow("id must be a number");
      expect(parseIntSpy).toHaveBeenCalledWith(
        "not a number, even when parsed"
      );
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        status: 400,
        error: "id must be a number",
        data: null,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if req.params.id is undefined and respond with status: 400, error: 'id must be a number' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: {},
      });

      const parseIntSpy = jest.spyOn(Number, "parseInt");

      expect.assertions(7);
      expect(parseIntSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).rejects.toThrow("id must be a number");
      expect(parseIntSpy).toHaveBeenCalledWith(undefined);
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        error: "id must be a number",
        data: null,
        status: 400,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if additional req.params are passed and respond with status: 400, a descriptive error of which was received and what was expected and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { id: "1", other: "not expected" },
      });

      const parseIntSpy = jest.spyOn(Number, "parseInt");

      expect.assertions(7);
      expect(parseIntSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).rejects.toThrow("id must be a number");
      expect(parseIntSpy).toHaveBeenCalledWith(1);
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        error: "id must be a number",
        data: null,
        status: 400,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("should return a user if req.params.id is a number to a valid user", async () => {
      const user = await User.create({
        name: "test",
        lastname: "test",
        password: "test",
        email: "test@test.com",
        is_admin: false,
        is_active: false,
        urlphoto: "test",
      });

      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { id: user._id.toString() },
      });

      const parseIntSpy = jest.spyOn(Number, "parseInt");

      expect.assertions(7);
      expect(parseIntSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.not.toBeDefined();
      expect(parseIntSpy).toHaveBeenCalledWith(user._id.toString());
      expect(mockedRes.status).toHaveBeenCalledWith(200);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        status: 200,
        message: "User found",
        data: user,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });
  });
});
