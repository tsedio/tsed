import {Injectable} from "@tsed/di";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {Get} from "@tsed/schema";

import {PlatformServerless, QueryParams} from "../src/index.js";

@Injectable()
class QueryLambda {
  @Get("/scenario-1")
  scenario1(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    return {
      startDate,
      endDate
    };
  }
}

describe("Query params", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [QueryLambda]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1: Get lambda with query", () => {
    it("should map data with query param", async () => {
      const response = await PlatformServerlessTest.request
        .call("scenario1")
        .get("/")
        .query({
          start_date: new Date("2020-01-01"),
          end_date: new Date("2020-01-10")
        });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        endDate: "2020-01-10T00:00:00.000Z",
        startDate: "2020-01-01T00:00:00.000Z"
      });
    });
  });
});
