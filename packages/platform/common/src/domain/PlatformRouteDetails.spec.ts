import {QueryParams} from "@tsed/platform-params";
import {Get, JsonEntityStore} from "@tsed/schema";
import {PlatformRouteDetails} from "./PlatformRouteDetails";

describe("PlatformRouteDetails", () => {
  it("should create JsonOperationRoute instance", () => {
    class Test {
      @Get("/")
      get(@QueryParams("test") test: string) {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "get");
    const routeDetails = new PlatformRouteDetails({
      token: Test,
      endpoint,
      operationPath: {method: "GET", path: "/"},
      basePath: "/base"
    });

    expect(routeDetails.toJSON()).toMatchObject({
      className: "Test",
      method: "GET",
      methodClassName: "get",
      name: "Test.get()",
      rawBody: false,
      url: "/base/"
    });
  });
});
