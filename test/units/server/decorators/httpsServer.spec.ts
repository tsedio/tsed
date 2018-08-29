import {Metadata} from "../../../../packages/core/class/Metadata";
import {HttpsServer} from "../../../../packages/common/server";
import {Sinon} from "../../../tools";

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
