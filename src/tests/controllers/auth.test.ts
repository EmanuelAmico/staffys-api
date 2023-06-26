import { AuthController } from "../../controllers";
import { AuthService } from "../../services";
import { mockControllerParams } from "../../utils/testing.utils";

describe("Auth Controller", () => {
  describe("Method -> resetPassword", () => {
    beforeAll(() => {
      jest.mock("../../services/auth.service", () => ({
        AuthService: {
          resetPassword: jest.fn(),
        },
      }));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("if req.body.email is not a valid email it should respond with status: 400, message: 'email must be a valid email' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          code: 123456,
          email: "not a valid email",
          password: "validPassword123456",
          confirmPassword: "validPassword123456",
        },
      });

      expect.assertions(4);

      await expect(
        AuthController.resetPassword(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(AuthService.resetPassword).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "email must be a valid email",
        data: null,
        status: 400,
      });
    });

    it("if req.body.code is not a valid code it should respond with status: 400, message: 'code is invalid' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          code: "not a valid code",
          email: "valid@email.com",
          password: "validPassword123456",
          confirmPassword: "validPassword123456",
        },
      });

      AuthService.resetPassword = jest
        .fn()
        .mockRejectedValueOnce(new Error("code is invalid"));

      expect.assertions(5);

      await expect(
        AuthController.resetPassword(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(AuthService.resetPassword).toHaveBeenCalledWith(
        mockedReq.body.email,
        mockedReq.body.code,
        mockedReq.body.password
      );
      await expect(
        AuthService.resetPassword(
          mockedReq.body.email,
          mockedReq.body.code,
          mockedReq.body.password
        )
      ).rejects.toThrow("code is invalid");
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "code is invalid",
        data: null,
        status: 400,
      });
    });

    it("if req.body.password is not a valid password it should respond with status: 400, message: 'password must be at least 6 characters long and contain at least one letter and number' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          code: 123456,
          email: "valid@email.com",
          password: "invalid",
          confirmPassword: "invalid",
        },
      });

      expect.assertions(4);

      await expect(
        AuthController.resetPassword(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(AuthService.resetPassword).not.toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message:
          "password must be at least 6 characters long and contain at least one letter and number",
        data: null,
        status: 400,
      });
    });

    it("if req.body.password and req.body.confirmPassword do not match it should respond with status: 400, message: 'passwords do not match' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          code: 123456,
          email: "valid@email.com",
          password: "validPassword123456",
          confirmPassword: "invalidPassword123456",
        },
      });

      expect.assertions(3);

      await expect(
        AuthController.resetPassword(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "passwords do not match",
        data: null,
        status: 400,
      });
    });

    it("if all parameters are valid it should respond with status: 200, message: 'password reset successfully' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          code: 123456,
          email: "valid@email.com",
          password: "validPassword123456",
          confirmPassword: "validPassword123456",
        },
      });

      AuthService.resetPassword = jest.fn().mockResolvedValue(undefined);

      expect.assertions(5);

      await expect(
        AuthController.resetPassword(mockedReq, mockedRes, mockedNext)
      ).resolves.toBeUndefined();
      expect(AuthService.resetPassword).toHaveBeenCalledWith(
        mockedReq.body.email,
        mockedReq.body.code,
        mockedReq.body.password
      );
      await expect(
        AuthService.resetPassword(
          mockedReq.body.email,
          mockedReq.body.code,
          mockedReq.body.password
        )
      ).resolves.toBeUndefined();
      expect(mockedRes.status).toHaveBeenCalledWith(200);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "password reset successfully",
        data: null,
        status: 200,
      });
    });
  });
});
