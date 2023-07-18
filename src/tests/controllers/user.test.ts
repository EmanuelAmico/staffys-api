import { envs } from "../../config/env/env.config";
import { UserController } from "../../controllers/user.controller";
import { User } from "../../models/User.model";
import { UserService } from "../../services/user.service";
import { mockControllerParams } from "../../utils/testing.utils";
import mongoose from "mongoose";
const {
  Types: { ObjectId },
} = mongoose;
const { MONGO_URI } = envs;

describe("User Controller", () => {
  describe("Method -> getUserById", () => {
    const isValidObjectIdSpy = jest.spyOn(ObjectId, "isValid");

    beforeAll(async () => {
      await mongoose.connect(MONGO_URI);
      jest.mock("../../services/user.service");
    });

    afterAll(async () => {
      await User.deleteMany({});
      await mongoose.disconnect();
      jest.clearAllMocks();
    });

    it("if req.params.id is not a posible ObjectId it should respond with status: 400, message: 'id must be a valid ObjectId' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { _id: "not a valid ObjectId, even when parsed" },
      }) as Parameters<typeof UserController.getUserById>;

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
        // eslint-disable-next-line quotes
        message: 'Properties with incorrect types: {"_id":"ObjectId"}',
        data: null,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it("if req.params.id is undefined it should respond with status: 400, message: 'These fields are required: _id' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: {},
      }) as Parameters<typeof UserController.getUserById>;

      expect.assertions(7);
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.status).toHaveBeenCalledTimes(1);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "These fields are required: _id",
        data: null,
        status: 400,
      });
      expect(mockedRes.send).toHaveBeenCalledTimes(1);
    });

    it.skip("if additional not required req.body and req.query are passed it should respond with status: 400, a descriptive error message of which was received and what was expected and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { _id: "507f1f77bcf86cd799439011" },
        body: { other: "not expected" },
        query: { thisToo: "not expected" },
      }) as unknown as Parameters<typeof UserController.getUserById>;

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
        is_able_to_deliver: false,
        is_disabled: false,
        urlphoto: "test",
      });

      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        params: { id: user._id.toString() },
      }) as unknown as Parameters<typeof UserController.getUserById>;

      UserService.getUserById = jest.fn().mockResolvedValue(user);

      expect.assertions(8);
      expect(isValidObjectIdSpy).not.toHaveBeenCalled();
      await expect(
        UserController.getUserById(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(isValidObjectIdSpy).toHaveBeenCalledWith(user._id.toString());
      expect(UserService.getUserById).toHaveBeenCalledWith(user._id.toString());
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
