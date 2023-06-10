import request from "supertest";
import app from "../";
import { generateToken } from "../config/jwt/tokens";

describe("Route testing", () => {
  let server: ReturnType<typeof app.listen>;

  beforeAll(() => {
    server = app.listen(process.env.TESTING_PORT);
  });

  afterAll(() => {
    server.close();
  });

  const token = generateToken({ name: "Rafael" });

  describe("GET /", () => {
    it("should respond with status 401 when no authorization token provided in headers", async () => {
      const res = await request(server).get("/");
      expect(res.statusCode).toBe(401);
      expect(res.text).toBe("Authorization token not found");
    });

    it("should respond with status 401 when invalid authorization header", async () => {
      const res = await request(server)
        .get("/")
        .set("Authorization", `${token}`);
      expect(res.statusCode).toBe(401);
      expect(res.text).toBe("Invalid authorization header");
    });

    it("should respond with status 401 when the token is invalid", async () => {
      const res = await request(server)
        .get("/")
        .set("Authorization", "Bearer abcdefghijqlmnñoprstuvxyz");
      expect(res.statusCode).toBe(401);
      expect(res.text).toBe("Invalid authorization token");
    });

    it("should respond with status 200 when the token is valid", async () => {
      const res = await request(server)
        .get("/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBe("Rafael");
    });
  });

  describe("POST /token", () => {
    it("should respond with status 200 and the token in response body", async () => {
      const res = await request(server).post("/token").send({ name: "Rafael" });
      expect(res.statusCode).toBe(200);
      expect(res.text).toBeDefined();
    });
  });
});
