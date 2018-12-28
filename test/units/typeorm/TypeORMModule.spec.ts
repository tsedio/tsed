import {ServerSettingsService} from "@tsed/common";
import {inject} from "@tsed/testing";
import {TypeORMModule} from "../../../packages/typeorm/src";
import * as Sinon from "sinon";

describe("TypeORMModule", () => {
  describe("$onInit()", () => {
    before(
      inject([TypeORMModule, ServerSettingsService], (service: TypeORMModule, settings: ServerSettingsService) => {
        this.service = service;
        settings.set("typeorm", {
          db1: {
            config: "config"
          }
        });

        this.createConnectionStub = Sinon.stub(this.service.typeORMService, "createConnection").resolves("connection");

        return (this.result = this.service.$onInit());
      })
    );

    after(
      inject([ServerSettingsService], (settings: ServerSettingsService) => {
        settings.set("typeorm", {});
        this.createConnectionStub.restore();
      })
    );

    it("should call the connect method", () => {
      this.createConnectionStub.should.have.been.calledWithExactly("db1", {config: "config"});
    });

    it("should return a promise", () => {
      this.result.should.eventually.deep.eq(["connection"]);
    });
  });
});
