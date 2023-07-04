import mongoose from "mongoose";
import User from "../../models/User.model";
import { envs } from "../../config/env/env.config";

const { MONGO_URI } = envs;

describe("User Model", () => {
  beforeAll(async () => {
    mongoose.connect(MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should create a new user", async () => {
    const newUser = new User({
      name: "John",
      lastname: "Doe",
      password: "password123",
      email: "john@example.com",
      urlphoto: "http://example.com/photo.jpg",
    });

    expect(newUser._id).toBeDefined();

    expect(newUser.name).toBe("John");
    expect(newUser.email).toBe("john@example.com");
  });
});
