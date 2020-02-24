import {Platform} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {RouteService} from "./RouteService";

class Test {}

describe("RouteService", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);
  it("should return a routerService", async () => {
    const platform = {
      routes: [],
      addRoutes: Sinon.stub(),
      addRoute: Sinon.stub(),
      getRoutes: Sinon.stub()
    };
    const routeService = await TestContext.invoke<RouteService>(RouteService, [
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
