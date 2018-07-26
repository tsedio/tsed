import {expect} from "chai";
import {RouteService} from "../../../../packages/common/src";
import {inject} from "../../../../packages/testing/src";

describe("RouteService", () => {
  it("should inject RouteService and return routes", inject([RouteService], (routeService: RouteService) => {
    const routes = routeService.getAll();

    expect(routes).to.be.an("array");
  }));

  it("should inject RouteService and print routes", inject([RouteService], (routeService: RouteService) => {
    let str = "";

    // tslint:disable-next-line: no-unused-variable
    const routes = routeService.printRoutes({
      info: (...args: any[]) => (str += args.join(" "))
    });

    expect(!!str).to.be.true;
  }));

  it("should inject RouteService and print routes", inject([RouteService], (routeService: RouteService) => {
    routeService.printRoutes();
  }));
});
