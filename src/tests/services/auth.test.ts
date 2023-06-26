import { AuthService } from "../../services/auth.service";
import User from "../../models/User";
import mongoose from "mongoose";
import { envs } from "../../config/env/env.config";

const { MONGO_URI } = envs;

describe("Auth Service", () => {
  describe("Method -> resetPassword", () => {
    beforeAll(async () => {
      await mongoose.connect(MONGO_URI);
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any;

    const resetPasswordServiceSpy = jest.spyOn(AuthService, "resetPassword");

    beforeEach(async () => {
      const createdUser = await User.create({
        name: "test",
        lastname: "test",
        password: "test",
        email: "test@test.com",
        is_admin: false,
        is_active: false,
        urlphoto: "test",
      });

      user = createdUser;
    });

    it("if code is invalid, throws an error with message 'code is invalid'", async () => {
      expect.assertions(3);

      await expect(
        AuthService.resetPassword(
          "valid@email.com",
          99999999999,
          "validPassword1234"
        )
      ).rejects.toThrow("code is invalid");
      expect(resetPasswordServiceSpy).toHaveBeenCalledWith(
        "validEmail",
        99999999999,
        "validPassword1234"
      );
      expect(resetPasswordServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("if code is valid, then its supposed that email and password have a valid values (checked in controller) then it should succeed in modifying user password with a new password", async () => {
      const updateOneSpy = jest.spyOn(User, "updateOne");
      const oldUserSalt = user.salt;
      const oldUserPassword = user.password;

      expect.assertions(6);

      await expect(
        AuthService.resetPassword(
          "valid@email.com",
          123456,
          "validPassword1234"
        )
      ).resolves.not.toBeDefined();
      expect(resetPasswordServiceSpy).toHaveBeenCalledWith(
        "validEmail",
        123456,
        "validPassword1234"
      );
      expect(updateOneSpy).toHaveBeenCalledWith(
        { email: user.email },
        { password: "validPassword1234" }
      );
      expect(updateOneSpy).toHaveBeenCalledTimes(1);
      const updatedUser = await User.findById(user._id).exec();
      expect(updatedUser?.salt).not.toEqual(oldUserSalt);
      expect(updatedUser?.password).not.toEqual(oldUserPassword);
    });
  });
});
