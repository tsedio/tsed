import {Platform, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {RouteService} from "./RouteService";

class Test {}

describe("RouteService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should return a routerService", async () => {
    const platform = {
      routes: [],
      addRoutes: Sinon.stub(),
      addRoute: Sinon.stub(),
      getRoutes: Sinon.stub()
    };
    const routeService = await PlatformTest.invoke<RouteService>(RouteService, [
      {
        token: Platform,
        use: platform
      }
    ]);

    routeService.addRoutes([
      {
        token: Test,
        route: "/"
      }
    ]);
    routeService.addRoute("/", Test);
    routeService.getRoutes();

    expect(routeService.routes).to.deep.eq([]);
    platform.addRoute.should.have.been.calledWithExactly("/", Test);
    platform.addRoutes.should.have.been.calledWithExactly([
      {
        token: Test,
        route: "/"
      }
    ]);
    platform.getRoutes.should.have.been.calledWithExactly();
  });
});
