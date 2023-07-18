import { AuthService } from "../../services/auth.service";
import { User } from "../../models/User.model";
import mongoose from "mongoose";
import { envs } from "../../config/env/env.config";
import { sendEmail } from "../../utils/mailer.utils";

const { MONGO_URI } = envs;

jest.mock("../../utils/mailer.utils");

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
        email: "valid@email.com",
        is_admin: false,
        is_able_to_deliver: false,
        is_disabled: false,
        urlphoto: "test",
      });

      user = createdUser;
    });

    it("if provided email does not correspond to any user, throws an error with message 'User was not found'", async () => {
      const findOneSpy = jest.spyOn(User, "findOne");

      expect.assertions(3);

      await expect(
        AuthService.resetPassword(
          "validEmailButNotInDatabase@email.com",
          123456,
          "validPassword1234"
        )
      ).rejects.toThrow("User was not found");
      expect(findOneSpy).toHaveBeenCalledWith({
        email: "validEmailButNotInDatabase@email.com",
      });
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it("if code is invalid, throws an error with message 'Invalid code'", async () => {
      expect.assertions(3);

      await expect(
        AuthService.resetPassword(
          "valid@email.com",
          99999999999,
          "validPassword1234"
        )
      ).rejects.toThrow("Invalid code");
      expect(resetPasswordServiceSpy).toHaveBeenCalledWith(
        "valid@email.com",
        99999999999,
        "validPassword1234"
      );
      expect(resetPasswordServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("if code is valid, then its supposed that email and password have a valid values (checked in controller) then it should succeed in modifying user password with a new password", async () => {
      const userInstanceSaveSpy = jest.spyOn(user, "save");
      const oldUserSalt = user.salt;
      const oldUserPassword = user.password;
      const code = await user.generateResetPasswordCode();

      expect.assertions(8);

      await expect(
        AuthService.resetPassword("valid@email.com", code, "validPassword1234")
      ).resolves.toBeUndefined();
      expect(resetPasswordServiceSpy).toHaveBeenCalledWith(
        "valid@email.com",
        code,
        "validPassword1234"
      );
      expect(userInstanceSaveSpy).toHaveBeenCalled();
      expect(userInstanceSaveSpy).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledTimes(1);
      const updatedUser = await User.findById(user._id).exec();
      expect(updatedUser?.salt).not.toEqual(oldUserSalt);
      expect(updatedUser?.password).not.toEqual(oldUserPassword);
    });
  });
});
