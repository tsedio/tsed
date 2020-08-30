import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Mongoose from "mongoose";
import * as Sinon from "sinon";
import {MongooseService} from "../../src";

const sandbox = Sinon.createSandbox();
describe("Mongoose", () => {
  describe("MongooseService", () => {
    beforeEach(async () => {
      await PlatformTest.create({
        logger: {
          level: "off",
        },
      });
      sandbox.stub(Mongoose, "createConnection");
    });

    afterEach(async () => {
      await PlatformTest.reset();
      sandbox.restore();
    });

    it("should call mongoose.connect", async () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
      // GIVEN
      const instance = {
        readyState: 1,
        close: Sinon.stub(),
      };

      (Mongoose.createConnection as any).resolves(instance);

      // WHEN
      await mongooseService.connect("key", "mongodb://test", {options: "options"} as any);

      const result = await mongooseService.connect("key", "mongodb://test", {options: "options"} as any);

      // THEN
      expect(result).to.eq(instance);
      expect(Mongoose.createConnection).to.have.been.calledOnce.and.calledWithExactly("mongodb://test", {options: "options"});
      expect(mongooseService.get()).to.eq(undefined);
      expect(mongooseService.has()).to.eq(false);
    });

    it("should close connection (1)", async () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
      // GIVEN
      const instance = {
        close: Sinon.stub(),
      };
      (Mongoose.createConnection as any).resolves(instance);

      // WHEN
      await mongooseService.connect("key1", "mongodb://test", {options: "options"} as any);
      await mongooseService.closeConnections();

      // THEN
      expect(instance.close).to.have.been.calledWithExactly();
    });

    it("should close connection (2)", async () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
      // GIVEN
      const instance = {
        close: Sinon.stub(),
      };
      (Mongoose.createConnection as any).resolves(instance);

      // WHEN
      await mongooseService.connect("key2", "mongodb://test", {options: "options"} as any);
      await mongooseService.closeConnections();

      // THEN
      expect(instance.close).to.have.been.calledWithExactly();
    });
  });
});
