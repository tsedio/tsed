import {inject} from "@tsed/testing/src";
import {RouteService} from "../../index";
import {printRoutes} from "./printRoutes";

describe("printRoutes()", () => {
  it("should return routes", inject([RouteService], (routeService: RouteService) => {
    const routes = routeService.getRoutes();

    // tslint:disable-next-line: no-unused-variable
    printRoutes(routes).should.be.a("string");
  }));
});
