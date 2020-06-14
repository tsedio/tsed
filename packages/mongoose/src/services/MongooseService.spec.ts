import {ServerSettingsService, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Mongoose from "mongoose";
import * as Sinon from "sinon";
import {MongooseService} from "../../src";

describe("MongooseService", () => {
  describe("connect()", () => {
    before(() => {
      Sinon.stub(Mongoose, "connect");
    });

    after(
      PlatformTest.inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
        serverSetttings.set("mongoose", {
          url: undefined,
          connectionOptions: undefined,
          urls: undefined
        });

        (Mongoose.connect as any).restore();
      })
    );

    afterEach(() => {
      (Mongoose.connect as any).reset();
    });

    it(
      "should call mongoose.connect",
      PlatformTest.inject([MongooseService], async (mongooseService: MongooseService) => {
        // GIVEN
        (Mongoose.connect as any).resolves("mongooseinstance" as any);

        // WHEN
        await mongooseService.connect("key", "mongodb://test", {options: "options"} as any);

        const result = await mongooseService.connect("key", "mongodb://test", {options: "options"} as any);

        // THEN
        result.should.eq("mongooseinstance");
        (Mongoose.connect as any).should.have.been.calledOnce.and.calledWithExactly("mongodb://test", {options: "options"});
        expect(mongooseService.get()).to.eq(undefined);
        expect(mongooseService.has()).to.eq(false);
      })
    );

    it(
      "should close connection (1)",
      PlatformTest.inject([MongooseService], async (mongooseService: MongooseService) => {
        // GIVEN
        const instance = {
          connection: {
            readyState: 1
          },
          disconnect: Sinon.stub()
        };
        (Mongoose.connect as any).resolves(instance);

        // WHEN
        await mongooseService.connect("key1", "mongodb://test", {options: "options"} as any);
        await mongooseService.closeConnections();

        // THEN
        instance.disconnect.should.have.been.calledWithExactly();
      })
    );

    it(
      "should close connection (2)",
      PlatformTest.inject([MongooseService], async (mongooseService: MongooseService) => {
        // GIVEN
        const instance = {
          connection: {
            readyState: 2
          },
          disconnect: Sinon.stub()
        };
        (Mongoose.connect as any).resolves(instance);

        // WHEN
        await mongooseService.connect("key2", "mongodb://test", {options: "options"} as any);
        await mongooseService.closeConnections();

        // THEN
        instance.disconnect.should.have.been.calledWithExactly();
      })
    );
  });
});
