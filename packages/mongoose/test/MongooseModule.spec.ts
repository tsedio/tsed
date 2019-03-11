import {ServerSettingsService} from "@tsed/common";
import {inject, TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {MongooseModule} from "../src";

describe("MongooseModule", () => {
  describe("$onInit()", () => {
    describe("when url is given", () => {
      before(
        inject([MongooseModule, ServerSettingsService], (mongooseModule: MongooseModule, serverSetttings: ServerSettingsService) => {
          this.mongooseModule = mongooseModule;

          serverSetttings.set("mongoose", {
            url: "mongodb://test",
            connectionOptions: {options: "options"}
          });

          this.connectStub = Sinon.stub(this.mongooseModule.mongooseService, "connect").resolves("test" as any);

          return (this.result = mongooseModule.$onInit());
        })
      );

      after(
        inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
          serverSetttings.set("mongoose", {
            url: undefined,
            connectionOptions: undefined,
            urls: undefined
          });
          this.connectStub.restore();
        })
      );
      after(TestContext.reset);

      it("should call the connect method", () => {
        this.connectStub.should.have.been.calledWithExactly("default", "mongodb://test", {options: "options"});
      });

      it("should return a promise", () => {
        this.result.should.eventually.deep.eq(["test"]);
      });
    });

    describe("when a list of urls is given", () => {
      before(
        inject([MongooseModule, ServerSettingsService], (mongooseModule: MongooseModule, serverSetttings: ServerSettingsService) => {
          this.mongooseModule = mongooseModule;

          serverSetttings.set("mongoose", {
            url: undefined,
            connectionOptions: undefined,
            urls: {
              db1: {
                url: "mongodb://test",
                connectionOptions: {options: "options"}
              }
            }
          });

          this.connectStub = Sinon.stub(this.mongooseModule.mongooseService, "connect").resolves("test" as any);

          return (this.result = mongooseModule.$onInit());
        })
      );

      after(
        inject([ServerSettingsService], (serverSetttings: ServerSettingsService) => {
          serverSetttings.set("mongoose", {
            url: undefined,
            connectionOptions: undefined,
            urls: undefined
          });
          this.connectStub.restore();
        })
      );

      it("should call the connect method", () => {
        this.connectStub.should.have.been.calledWithExactly("db1", "mongodb://test", {options: "options"});
      });

      it("should return a promise", () => {
        return this.result.should.eventually.deep.eq(["test"]);
      });
    });
  });
});
