import {PlatformTest} from "@tsed/platform-http/testing";
import Mongoose from "mongoose";

import {MongooseService} from "../../src/index.js";

describe("Mongoose", () => {
  describe("MongooseService", () => {
    beforeEach(async () => {
      await PlatformTest.create({
        logger: {
          level: "off"
        }
      });
    });

    afterEach(async () => {
      await PlatformTest.reset();
    });

    it("should call mongoose.connect", async () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
      // GIVEN
      const instance = {
        readyState: 1,
        close: vi.fn()
      };

      (Mongoose.createConnection as any) = vi.fn().mockResolvedValue(instance);

      // WHEN
      await mongooseService.connect("key", "mongodb://test", {options: "options"} as any);

      const result = await mongooseService.connect("key", "mongodb://test", {options: "options"} as any);

      // THEN
      expect(result).toBe(instance);
      expect(Mongoose.createConnection).toHaveBeenNthCalledWith(1, "mongodb://test", {options: "options"});
      expect(mongooseService.get()).toBeUndefined();
      expect(mongooseService.has()).toBe(false);
    });

    it("should close connection (1)", async () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
      // GIVEN
      const instance = {
        close: vi.fn()
      };
      (Mongoose.createConnection as any) = vi.fn().mockResolvedValue(instance);

      // WHEN
      await mongooseService.connect("key1", "mongodb://test", {options: "options"} as any);
      await mongooseService.closeConnections();

      // THEN
      expect(instance.close).toHaveBeenCalledWith();
    });
    it("should close connection (2)", async () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
      // GIVEN
      const instance = {
        close: vi.fn()
      };
      (Mongoose.createConnection as any) = vi.fn().mockResolvedValue(instance);

      // WHEN
      await mongooseService.connect("key2", "mongodb://test", {options: "options"} as any);
      await mongooseService.closeConnections();

      // THEN
      expect(instance.close).toHaveBeenCalledWith();
    });
  });
});
