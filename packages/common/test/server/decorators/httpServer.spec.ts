import {Metadata} from "@tsed/core";
import * as Sinon from "sinon";
import {HttpServer} from "../../../src/server";

describe("HttpServer", () => {
  before(() => {
    this.setParamTypesStub = Sinon.stub(Metadata, "setParamTypes");

    // tslint:disable-next-line: no-unused-variable
    class Test {
      constructor(@HttpServer https: HttpServer) {
      }
    }
  });
  after(() => {
    this.setParamTypesStub.restore();
  });

  it("should store metadata", () => {
    this.setParamTypesStub.should.have.been.calledWithExactly(Sinon.match.func, undefined, [HttpServer]);
  });
});
