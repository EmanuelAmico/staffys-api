import mongoose from "mongoose";

import User from "../../models/User";
import dotenv from "dotenv";
const variable = dotenv;
variable.config();

// TODO: Replace this with env config
const uri = process.env.MONGO_URI || "";
describe("User Model", () => {
  beforeAll(async () => {
    mongoose.connect(uri);
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
