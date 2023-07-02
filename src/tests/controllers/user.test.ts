import { UserController } from "../../controllers/user.controller";
import { User } from "../../models/User.model";
import { UserService } from "../../services/user.service";
import { mockControllerParams } from "../../utils/testing.utils";
import mongoose from "mongoose";
const {
  Types: { ObjectId },
} = mongoose;

describe.skip("User Controller", () => {
  describe("Method -> getUserById", () => {
    const isValidObjectIdSpy = jest.spyOn(ObjectId, "isValid");

    beforeAll(() => {
      jest.mock("../../services/user.service");
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("if req.params.id is not a posible ObjectId it should respond with status: 400, message: 'id must be a valid ObjectId' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { id: "not a valid ObjectId, even when parsed" },
      });

      expect.assertions(7);
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(isValidObjectIdSpy).toHaveBeenCalledWith(
        "not a valid ObjectId, even when parsed"
      );
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        status: 400,
        message: "id must be a valid ObjectId",
        data: null,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("if req.params.id is undefined it should respond with status: 400, message: 'id is required in req.params' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: {},
      });

      expect.assertions(7);
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "id is required in req.params",
        data: null,
        status: 400,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("if additional not required req.body and req.query are passed it should respond with status: 400, a descriptive error message of which was received and what was expected and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { id: "507f1f77bcf86cd799439011" },
        body: { other: "not expected" },
        query: { thisToo: "not expected" },
      });

      expect.assertions(7);
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message:
          "There are unexpected fields in the request. Received -> params: { id }, body: { other }, query: { thisToo }. Expected -> params: { id }, body: {}, query: {}",
        data: null,
        status: 400,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("should respond with a user if req.params.id is a valid ObjectId to an existing user", async () => {
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

      const getUserByIdServiceSpy = jest.spyOn(UserService, "getUserById");

      expect.assertions(8);
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(isValidObjectIdSpy).toHaveBeenCalledWith(user._id.toString());
      expect(getUserByIdServiceSpy).toHaveBeenCalledWith(user._id.toString());
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
