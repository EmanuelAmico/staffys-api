import { UserService } from "../../services/user.service";
import User from "../../models/User";

describe("User Service", () => {
  describe("Method -> getUserById", () => {
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
      await expect(UserService.getUserById(user.id)).resolves.toEqual(user);
      expect(findByIdSpy).toHaveBeenCalledWith(user.id);
    });

    it("returns a promise that fulfills with null if no user is found", async () => {
      const findByIdSpy = jest.spyOn(User, "findById");

      expect.assertions(3);
      expect(findByIdSpy).not.toHaveBeenCalled();
      await expect(UserService.getUserById("1")).resolves.toBeNull();
      expect(findByIdSpy).toHaveBeenCalledWith("1");
    });
  });
});
