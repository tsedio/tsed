import {Inject, Injectable, Controller} from "@tsed/di";
import {Lambda, PathParams, PlatformServerless, PlatformServerlessTest, QueryParams} from "@tsed/platform-serverless";

@Injectable()
class TimeslotsService {
  get() {
    return "test";
  }
}

@Controller("/")
class TimeslotsLambdaController {
  @Inject()
  protected timeslotsService: TimeslotsService;

  @Lambda()
  get(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    return {
      value: this.timeslotsService.get(),
      startDate,
      endDate
    };
  }

  @(Lambda().Name("byID"))
  getByID(@PathParams("id") id: string) {
    return {
      id
    };
  }

  other() {}
}

describe("PlatformServerless", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap({
      lambda: [TimeslotsLambdaController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  it("should load lambda", () => {
    const handlers = PlatformServerlessTest.callbacks;

    expect(handlers).toHaveProperty("get");
    expect(handlers).toHaveProperty("byID");
  });

  it("should call lambda", async () => {
    const response = await PlatformServerlessTest.request.call("get").query({
      start_date: new Date("2020-01-01"),
      end_date: new Date("2020-01-10")
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      endDate: "2020-01-10T00:00:00.000Z",
      startDate: "2020-01-01T00:00:00.000Z",
      value: "test"
    });
  });

  it("should call lambda with custom x-request-id", async () => {
    const response = await PlatformServerlessTest.request
      .call("get")
      .headers({
        "x-request-id": "request-id"
      })
      .query({
        start_date: new Date("2020-01-01"),
        end_date: new Date("2020-01-10")
      });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "request-id",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      endDate: "2020-01-10T00:00:00.000Z",
      startDate: "2020-01-01T00:00:00.000Z",
      value: "test"
    });
  });
});
