import {PlatformTest, RequestContext, Req} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import * as Passport from "passport";
import * as Sinon from "sinon";
import {stub} from "../../../../test/helper/tools";
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
    sandbox.stub(Passport, "use");
    Strategy.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(
    "should create a protocol",
    PlatformTest.inject([ProtocolsService, InjectorService], (protocolService: ProtocolsService, injector: InjectorService) => {
      // GIVEN
      const provider = injector.getProvider(LocalProtocol)!;

      // WHEN
      const result = protocolService.invoke(provider);

      // THEN
      result.should.be.instanceOf(LocalProtocol);
      result.$onInstall.should.have.been.calledWithExactly(protocolService.strategies.get("local"));
      Passport.use.should.have.been.calledWithExactly("local", protocolService.strategies.get("local"));
      Strategy.should.have.been.calledWithExactly(
        {
          passReqToCallback: true,
          prop1: "prop1",
          prop2: "prop2-server",
          prop3: "prop3"
        },
        Sinon.match.func
      );
      expect(protocolService.getProtocolsNames()).to.deep.equal(["local"]);
    })
  );

  it(
    "should call metadata",
    PlatformTest.inject([ProtocolsService, InjectorService], async (protocolService: ProtocolsService, injector: InjectorService) => {
      // GIVEN
      stub(LocalProtocol.prototype.$onVerify).returns({id: 0});
      const provider = injector.getProvider(LocalProtocol)!;
      const req = {
        res: {},
        ctx: new RequestContext({id: "1", logger: {}, url: "/"})
      };
      // WHEN
      const result = protocolService.invoke(provider);
      const resultDone: any = await new Promise(resolve => {
        Strategy.args[0][1](req, "test", (...args: any[]) => resolve(args));
      });

      // THEN
      result.$onVerify.should.have.been.calledWithExactly(req);
      expect(resultDone).to.deep.equal([null, {id: 0}]);
    })
  );

  it(
    "should call metadata and catch error",
    PlatformTest.inject([ProtocolsService, InjectorService], async (protocolService: ProtocolsService, injector: InjectorService) => {
      // GIVEN
      const error = new Error("message");
      stub(LocalProtocol.prototype.$onVerify).rejects(error);

      const provider = injector.getProvider(LocalProtocol)!;
      const req = {
        res: {},
        ctx: new RequestContext({id: "1", logger: {}, url: "/"})
      };
      // WHEN
      const result = protocolService.invoke(provider);
      const resultDone: any = await new Promise(resolve => {
        Strategy.args[0][1](req, "test", (...args: any[]) => resolve(args));
      });

      // THEN
      result.$onVerify.should.have.been.calledWithExactly(req);
      expect(resultDone).to.deep.equal([error, false, {message: "message"}]);
    })
  );
});
