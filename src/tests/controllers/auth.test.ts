import { AuthController } from "../../controllers";
import { AuthService } from "../../services";
import { mockControllerParams } from "../../utils/testing.utils";

jest.mock("../../services/auth.service", () => ({
  AuthService: {
    resetPassword: jest.fn(),
  },
}));

describe("Auth Controller", () => {
  describe("Method -> resetPassword", () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it("if req.body.email is not a valid email it should respond with status: 400, message: 'Email must be a valid email' and data: null", async () => {
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
        message: "Email must be a valid email",
        data: null,
        status: 400,
      });
    });

    it("if req.body.code is not a valid code it should respond with status: 400, message: 'Invalid code' and data: null", async () => {
      const [mockedReq, mockedRes, mockedNext] = mockControllerParams({
        body: {
          code: 99999999,
          email: "valid@email.com",
          password: "validPassword123456",
          confirmPassword: "validPassword123456",
        },
      });

      AuthService.resetPassword = jest
        .fn()
        .mockRejectedValue(new Error("Invalid code"));

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
      ).rejects.toThrow("Invalid code");
      expect(mockedRes.status).toHaveBeenCalledWith(400);
      expect(mockedRes.send).toHaveBeenCalledWith({
        message: "Invalid code",
        data: null,
        status: 400,
      });
    });

    it("if req.body.password is not a valid password it should respond with status: 400, message: 'Password must have at least one uppercase letter and a minimum length of 6 characters' and data: null", async () => {
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
          "Password must have at least one uppercase letter and a minimum length of 6 characters",
        data: null,
        status: 400,
      });
    });

    it("if req.body.password and req.body.confirmPassword do not match it should respond with status: 400, message: 'Passwords do not match' and data: null", async () => {
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
        message: "Passwords do not match",
        data: null,
        status: 400,
      });
    });

    it("if all parameters are valid it should respond with status: 200, message: 'Password reset successfully' and data: null", async () => {
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
        message: "Password reset successfully",
        data: null,
        status: 200,
      });
    });
  });
});
