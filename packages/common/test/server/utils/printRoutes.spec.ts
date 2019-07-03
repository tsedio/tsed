import {inject} from "../../../../testing/src";
import {RouteService} from "../../../src";
import {printRoutes} from "../../../src/server/utils/printRoutes";


describe("printRoutes()", () => {
  it("should return routes", inject([RouteService], (routeService: RouteService) => {
    const routes = routeService.getRoutes();

    // tslint:disable-next-line: no-unused-variable
    printRoutes(routes).should.be.a("string");
  }));
});
