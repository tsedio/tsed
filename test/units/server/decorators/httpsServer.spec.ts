import {Metadata} from "@tsed/core";
import {HttpsServer} from "../../../../packages/common/src/server";
import * as Sinon from "sinon";

describe("HttpsServer", () => {
  before(() => {
    this.setParamTypesStub = Sinon.stub(Metadata, "setParamTypes");

    // tslint:disable-next-line: no-unused-variable
    class Test {
      constructor(@HttpsServer https: HttpsServer) {}
    }
  });
  after(() => {
    this.setParamTypesStub.restore();
  });

  it("should store metadata", () => {
    this.setParamTypesStub.should.have.been.calledWithExactly(Sinon.match.func, undefined, [HttpsServer]);
  });
});
