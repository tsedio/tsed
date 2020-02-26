import {InjectorService, PlatformHandler, PlatformRouter} from "@tsed/common";
import {expect} from "chai";
import * as Express from "express";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";

const sandbox = Sinon.createSandbox();
describe("PlatformRouter", () => {
  beforeEach(() => {
    sandbox.stub(Express, "Router");
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe("create()", () => {
    it("should create a new router", async () => {
      // GIVEN
      const nativeDriver = {
        use: sandbox.stub(),
        all: sandbox.stub(),
        get: sandbox.stub(),
        post: sandbox.stub(),
        put: sandbox.stub(),
        delete: sandbox.stub(),
        patch: sandbox.stub(),
        head: sandbox.stub(),
        options: sandbox.stub()
      };

      stub(Express.Router).returns(nativeDriver);

      const platformHandler = {
        createHandler: sandbox.stub().callsFake(o => o)
      };

      const injector = new InjectorService();
      injector.addProvider(PlatformHandler, {
        useValue: platformHandler
      });

      injector.settings.routers = {
        mergeParams: true
      };

      const routerOptions: any = {
        test: "options"
      };

      // WHEN
      const router = PlatformRouter.create(injector, routerOptions);

      // THEN
      Express.Router.should.have.been.calledWithExactly({...injector.settings.routers, ...routerOptions});

      expect(router.raw).to.deep.eq(nativeDriver);
    });
  });
});
