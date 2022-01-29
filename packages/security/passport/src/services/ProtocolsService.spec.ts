import {PlatformTest, Req} from "@tsed/common";
import {expect} from "chai";
import Passport from "passport";
import Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
import {Protocol, ProtocolsService} from "../index";

const sandbox = Sinon.createSandbox();
// tslint:disable-next-line:variable-name
const Strategy = Sinon.stub();

describe("ProtocolsService", () => {
  @Protocol({
    name: "local",
    useStrategy: Strategy as any,
    settings: {
      prop1: "prop1",
      prop2: "prop2"
    }
  })
  class LocalProtocol {
    async $beforeInstall(settings: any) {
      return settings;
    }

    $onInstall() {}

    $onVerify(@Req() req: Req) {
      return {id: 0};
    }
  }

  beforeEach(() =>
    PlatformTest.create({
      passport: {
        protocols: {
          local: {
            settings: {
              prop2: "prop2-server",
              prop3: "prop3"
            }
          }
        }
      }
    })
  );
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    sandbox.stub(LocalProtocol.prototype, "$onInstall");
    sandbox.stub(LocalProtocol.prototype, "$onVerify");
    sandbox.spy(LocalProtocol.prototype, "$beforeInstall");
    sandbox.stub(Passport, "use");
    Strategy.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a protocol", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;

    // WHEN
    const result = await protocolService.invoke(provider);

    // THEN
    expect(result).to.be.instanceof(LocalProtocol);
    expect(result.$onInstall).to.have.been.calledWithExactly(protocolService.strategies.get("local"));
    expect(result.$beforeInstall).to.have.been.calledWithExactly({
      passReqToCallback: true,
      prop1: "prop1",
      prop2: "prop2-server",
      prop3: "prop3"
    });
    expect(Passport.use).to.have.been.calledWithExactly("local", protocolService.strategies.get("local"));
    expect(Strategy).to.have.been.calledWithExactly(
      {
        passReqToCallback: true,
        prop1: "prop1",
        prop2: "prop2-server",
        prop3: "prop3"
      },
      Sinon.match.func
    );
    expect(protocolService.getProtocolsNames().includes("local")).to.deep.equal(true);
  });

  it("should call metadata", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    stub(LocalProtocol.prototype.$onVerify).returns({id: 0});
    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;
    const ctx = PlatformTest.createRequestContext();

    // WHEN
    const result = await protocolService.invoke(provider);
    const resultDone: any = await new Promise((resolve) => {
      Strategy.args[0][1](ctx.getRequest(), "test", (...args: any[]) => resolve(args));
    });

    // THEN
    expect(result.$onVerify).to.have.been.calledWithExactly(ctx.getRequest(), ctx);
    expect(resultDone).to.deep.equal([null, {id: 0}]);
  });

  it("should call metadata and catch error", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    const error = new Error("message");
    stub(LocalProtocol.prototype.$onVerify).rejects(error);

    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;
    const ctx = PlatformTest.createRequestContext();

    // WHEN
    const result = await protocolService.invoke(provider);
    const resultDone: any = await new Promise((resolve) => {
      Strategy.args[0][1](ctx.getRequest(), "test", (...args: any[]) => resolve(args));
    });

    // THEN
    expect(result.$onVerify).to.have.been.calledWithExactly(ctx.getRequest(), ctx);
    expect(resultDone).to.deep.equal([error, false, {message: "message"}]);
  });
});
