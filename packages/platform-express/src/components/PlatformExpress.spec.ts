import {PlatformApplication, PlatformHandler, PlatformRequest, PlatformResponse, PlatformRouter} from "@tsed/common";
import {
  PlatformExpressApplication,
  PlatformExpressHandler,
  PlatformExpressRequest,
  PlatformExpressResponse,
  PlatformExpressRouter
} from "@tsed/platform-express";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stub} from "../../../../test/helper/tools";
import {PlatformExpress} from "./PlatformExpress";

const sandbox = Sinon.createSandbox();

describe("PlatformExpress", () => {
  beforeEach(() => {
    sandbox.stub(PlatformExpress, "build");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should create the platform", async () => {
    class Test {}

    const platform = {bootstrap: sandbox.stub().returnsThis(), useProviders: sandbox.stub().returnsThis()};

    stub(PlatformExpress.build).returns(platform);

    await PlatformExpress.bootstrap(Test, {});
    await PlatformExpress.bootstrap(Test);

    expect(PlatformExpress.build).to.have.been.calledWithExactly(PlatformExpress);
    expect(platform.bootstrap).to.have.been.calledWithExactly(Test, {});
    expect(PlatformExpress.providers).to.deep.equal([
      {
        provide: PlatformApplication,
        useClass: PlatformExpressApplication
      },
      {
        provide: PlatformRouter,
        useClass: PlatformExpressRouter
      },
      {
        provide: PlatformHandler,
        useClass: PlatformExpressHandler
      },
      {
        provide: PlatformResponse,
        useClass: PlatformExpressResponse
      },
      {
        provide: PlatformRequest,
        useClass: PlatformExpressRequest
      }
    ]);
  });
});
