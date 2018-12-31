import {inject, TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import * as TypeORM from "typeorm";
import {TypeORMService} from "../../src";

describe("TypeORMService", () => {
  describe("createConnection()", () => {
    before(
      inject([TypeORMService], (service: TypeORMService) => {
        this.connectStub = Sinon.stub(TypeORM, "createConnection").resolves("connection");

        return (this.result = service.createConnection("key", {config: "config"} as any).then(() => {
          return service.createConnection("key", {config: "config"} as any);
        }));
      })
    );

    after(() => {
      TestContext.reset();
      this.connectStub.restore();
    });

    it("should call mongoose.connect", () => {
      this.connectStub.should.have.been.calledOnce;
      this.connectStub.should.have.been.calledWithExactly({config: "config"});
    });

    it("should return the instance of mongoose", () => {
      return this.result.should.eventually.eq("connection");
    });
  });
});
