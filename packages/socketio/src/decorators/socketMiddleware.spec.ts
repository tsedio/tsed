import * as common from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {SocketMiddleware} from "../index";
import {SocketProviderTypes} from "../interfaces/ISocketProviderMetadata";

describe("@SocketMiddleware", () => {
  class Test {}

  before(() => {
    this.decoratorStub = Sinon.stub();
    this.middlewareStub = Sinon.stub(common, "Middleware").returns(this.decoratorStub);

    SocketMiddleware()(Test);
  });

  after(() => {
    this.middlewareStub.restore();
  });

  it("should register the metadata", () => {
    expect(Store.from(Test).get("socketIO")).to.deep.eq({
      type: SocketProviderTypes.MIDDLEWARE,
      handlers: {
        use: {
          methodClassName: "use",
        },
      },
    });
  });

  it("should register the middleware", () => {
    expect(this.middlewareStub).to.have.been.calledWithExactly();
    expect(this.decoratorStub).to.have.been.calledWithExactly(Test);
  });
});
