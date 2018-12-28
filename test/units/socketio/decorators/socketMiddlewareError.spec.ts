import * as common from "@tsed/common";
import {Store} from "@tsed/core";
import {SocketMiddlewareError} from "../../../../packages/socketio/src/decorators/socketMiddlewareError";
import {SocketProviderTypes} from "../../../../packages/socketio/src/interfaces/ISocketProviderMetadata";
import {expect} from "chai";
import * as Sinon from "sinon";

describe("@SocketMiddlewareError", () => {
  class Test {}

  before(() => {
    this.decoratorStub = Sinon.stub();
    this.middlewareStub = Sinon.stub(common, "MiddlewareError").returns(this.decoratorStub);

    SocketMiddlewareError()(Test);
  });

  after(() => {
    this.middlewareStub.restore();
  });

  it("should register the metadata", () => {
    expect(Store.from(Test).get("socketIO")).to.deep.eq({
      type: SocketProviderTypes.MIDDLEWARE,
      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });
  });

  it("should register the middleware", () => {
    this.middlewareStub.should.have.been.called;
    this.decoratorStub.should.have.been.calledWithExactly(Test);
  });
});
