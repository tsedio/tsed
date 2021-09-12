import {expect} from "chai";
import {Platform, PlatformTest} from "@tsed/common";
import {printRoutes} from "./printRoutes";

describe("printRoutes()", () => {
  it(
    "should return routes",
    PlatformTest.inject([Platform], (platform: Platform) => {
      const routes = platform.getRoutes();

      // tslint:disable-next-line: no-unused-variable
      expect(printRoutes(routes)).to.be.a("string");
    })
  );
});
