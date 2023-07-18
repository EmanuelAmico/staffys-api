import { UserService } from "../../services/user.service";
import { User } from "../../models/User.model";
import mongoose from "mongoose";
import { envs } from "../../config/env/env.config";

const { MONGO_URI } = envs;

describe("User Service", () => {
  describe("Method -> getUserById", () => {
    beforeAll(async () => {
      await mongoose.connect(MONGO_URI);
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it("returns a promise that fulfills with null if no user is found", async () => {
      const id = "507f1f77bcf86cd799439011";
      const findByIdSpy = jest.spyOn(User, "findById");

      expect.assertions(3);
      expect(findByIdSpy).not.toHaveBeenCalled();
      await expect(UserService.getUserById(id)).resolves.toBeNull();
      expect(findByIdSpy).toHaveBeenCalledWith(id);
    });

    it("calls User.findByPk with the correct id and returns the promise that is to be resolved with the correct user", async () => {
      const createdUser = await User.create({
        name: "test",
        lastname: "test",
        password: "test",
        email: "test@test.com",
        is_admin: false,
        is_able_to_deliver: false,
        is_disabled: false,
        urlphoto: "test",
      });

      const user = await User.findOne({
        _id: createdUser._id.toString(),
      })
        .select("-salt -password")
        .exec();

      if (!user) {
        throw new Error("User not found in tests");
      }

      const findByIdSpy = jest.spyOn(User, "findById");

      expect.assertions(3);
      expect(findByIdSpy).not.toHaveBeenCalled();
      await expect(
        UserService.getUserById(user._id.toString())
      ).resolves.toEqual(user);
      expect(findByIdSpy).toHaveBeenCalledWith(user._id.toString());
    });
  });
});
