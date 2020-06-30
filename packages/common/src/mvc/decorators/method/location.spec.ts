import {EndpointMetadata} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../../test/helper";
import {Location} from "./location";

const middleware: any = Sinon.stub();
const useAfterStub: any = Sinon.stub().returns(middleware);

describe("Location", () => {
  it("should create middleware", () => {
    class Test {
      @Location("test")
      test() {

      }
    }

    const nextSpy = Sinon.stub();
    const response = new FakeResponse();
    const endpoint = EndpointMetadata.get(Test, "test");
    const middleware = endpoint.afterMiddlewares[0];

    Sinon.stub(response, "location");

    expect(middleware).to.be.a("function");

    middleware({}, response, nextSpy);

    expect(response.location).to.have.been.calledWithExactly("test");

    return expect(nextSpy).to.have.been.calledOnceWithExactly();
  });
});
