import {PlatformApplication, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

describe("PlatformExpressApplication", () => {
  class TestServer {}

  beforeEach(
    PlatformTest.bootstrap(TestServer, {
      platform: PlatformExpress
    })
  );
  afterEach(() => PlatformTest.reset());

  it("should create PlatformExpress with his driver", () => {
    const app = PlatformTest.get<PlatformApplication>(PlatformApplication);

    expect(app.getApp()).to.deep.eq(app.raw);
    expect(app.getApp()).to.deep.eq(app.rawRouter);
  });

  // describe("statics()", () => {
  //   it("should create a PlatformApplication", async () => {
  //     const middlewareServeStatic = sandbox.stub();
  //
  //     stub(Express.static).returns(middlewareServeStatic);
  //
  //     const app = await PlatformTest.invoke<PlatformApplication>(PlatformApplication);
  //
  //     sandbox.stub(app, "use");
  //
  //     app.statics("/path", {
  //       root: "/publics",
  //       options: "options"
  //     });
  //
  //     expect(Express.static).to.have.been.calledWithExactly(Sinon.match("/publics"), {options: "options"});
  //     expect(app.use).to.have.been.calledWithExactly("/path", Sinon.match.func);
  //   });
  // });
});
