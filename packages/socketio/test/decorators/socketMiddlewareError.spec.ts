import * as common from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {SocketMiddlewareError} from "../../src";
import {SocketProviderTypes} from "../../src/interfaces/ISocketProviderMetadata";

describe("@SocketMiddlewareError", () => {
  class Test {
  }

  before(() => {
    Sinon.stub(common, "Middleware");
  });

  after(() => {
    // @ts-ignore
    common.Middleware.restore();
  });

  it("should register the metadata and middleware", () => {
    const decoratorStub = Sinon.stub();
    // @ts-ignore
    common.Middleware.returns(decoratorStub);

    SocketMiddlewareError()(Test);
    expect(Store.from(Test).get("socketIO")).to.deep.eq({
      type: SocketProviderTypes.MIDDLEWARE,
      error: true,
      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });

    common.Middleware.should.have.been.calledWithExactly();
    decoratorStub.should.have.been.calledWithExactly(Test);
  });
});
