import {ServerSettingsService} from "@tsed/common";
import {inject, TestContext} from "@tsed/testing";
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
      inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
        serverSetttings.set("mongoose", {
          url: undefined,
          connectionOptions: undefined,
          urls: undefined
        });

        (Mongoose.connect as any).restore();
      })
    );

    it("should call mongoose.connect", inject([MongooseService], async (mongooseService: MongooseService) => {
      // GIVEN
      (Mongoose.connect as any).resolves("mongooseinstance" as any);

      // WHEN
      await mongooseService
        .connect(
          "key",
          "mongodb://test",
          {options: "options"} as any
        );

      const result = await mongooseService.connect(
        "key",
        "mongodb://test",
        {options: "options"} as any
      );

      // THEN
      result.should.eq("mongooseinstance");
      (Mongoose.connect as any).should.have.been.calledOnce.and.calledWithExactly("mongodb://test", {options: "options"});
      expect(mongooseService.get()).to.eq(undefined);
      expect(mongooseService.has()).to.eq(false);
    }));
  });
});
