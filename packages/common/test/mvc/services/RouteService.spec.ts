import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {InjectorService, RouteService} from "../../../src";

describe("RouteService", () => {
  it("should inject RouteService and return routes", inject([RouteService], (routeService: RouteService) => {
    const routes = routeService.getAll();

    expect(routes).to.be.an("array");
  }));

  it("should inject RouteService and print routes", inject([InjectorService, RouteService], (injector: InjectorService, routeService: RouteService) => {
    (injector.logger.info as any).resetHistory();
    // tslint:disable-next-line: no-unused-variable
    routeService.printRoutes();

    injector.logger.info.should.have.been.calledWithExactly(Sinon.match.string);
  }));
});
