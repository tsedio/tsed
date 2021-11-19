import {PlatformApplication, PlatformHandler, PlatformRequest, PlatformResponse, PlatformRouter} from "@tsed/common";
import {PlatformKoaApplication, PlatformKoaHandler, PlatformKoaRequest, PlatformKoaResponse, PlatformKoaRouter} from "@tsed/platform-koa";
import {expect} from "chai";
import Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {PlatformKoa} from "./PlatformKoa";

const sandbox = Sinon.createSandbox();

describe("PlatformKoa", () => {
  beforeEach(() => {
    sandbox.stub(PlatformKoa, "build");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should create the platform", async () => {
    class Test {}

    const platform = {bootstrap: sandbox.stub().returnsThis(), useProviders: sandbox.stub().returnsThis()};

    stub(PlatformKoa.build).returns(platform);

    await PlatformKoa.bootstrap(Test, {});
    await PlatformKoa.bootstrap(Test);

    expect(PlatformKoa.build).to.have.been.calledWithExactly(PlatformKoa, Test, {});
    expect(platform.bootstrap).to.have.been.calledWithExactly();
    expect(PlatformKoa.providers).to.deep.equal([
      {
        provide: PlatformResponse,
        useClass: PlatformKoaResponse
      },
      {
        provide: PlatformRequest,
        useClass: PlatformKoaRequest
      },
      {
        provide: PlatformHandler,
        useClass: PlatformKoaHandler
      },
      {
        provide: PlatformRouter,
        useClass: PlatformKoaRouter
      },
      {
        provide: PlatformApplication,
        useClass: PlatformKoaApplication
      }
    ]);
  });
});
