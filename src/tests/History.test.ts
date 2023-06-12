import mongoose from "mongoose";
import History from "../models/History";

describe("History Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await History.deleteMany({});
  });

  describe("History Model", () => {
    it("guarda un día correctamente", async () => {
      const newDay = new History({
        date: "16/02/23",
      });

      const savedDay = await newDay.save();
      //console.log(savedDay);
      expect(savedDay._id).toBeDefined();
      expect(savedDay.date).toBe("16/02/23");
    });
  });
});

//import { MongoMemoryServer } from "mongodb-memory-server";
//let mongoServer: MongoMemoryServer;
//mongoServer = await MongoMemoryServer.create();
//const uri = mongoServer.getUri();
//await mongoose.connect(uri);
