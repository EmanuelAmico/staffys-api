import { UserService } from "../../services/user.service";
import { User } from "../../models/User.model";
import mongoose from "mongoose";
import { envs } from "../../config/env/env.config";

const { MONGO_URI } = envs;
const {
  Types: { ObjectId },
} = mongoose;

describe.skip("User Service", () => {
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

    it("calls User.findByPk with the correct id and returns the promise that is to be resolved with the correct user", async () => {
      const user = await User.create({
        name: "test",
        lastname: "test",
        password: "test",
        email: "test@test.com",
        is_admin: false,
        is_active: false,
        urlphoto: "test",
      });

      const findByIdSpy = jest.spyOn(User, "findById");

      expect.assertions(3);
      expect(findByIdSpy).not.toHaveBeenCalled();
      await expect(UserService.getUserById(user._id)).resolves.toEqual(user);
      expect(findByIdSpy).toHaveBeenCalledWith(user._id);
    });

    it("returns a promise that fulfills with null if no user is found", async () => {
      const id = new ObjectId("1");
      const findByIdSpy = jest.spyOn(User, "findById");

      expect.assertions(3);
      expect(findByIdSpy).not.toHaveBeenCalled();
      await expect(UserService.getUserById(id)).resolves.toBeNull();
      expect(findByIdSpy).toHaveBeenCalledWith(id);
    });
  });
});
