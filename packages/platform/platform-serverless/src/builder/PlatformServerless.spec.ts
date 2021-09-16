import {Inject, Injectable} from "@tsed/di";
import {Lambda, PathParams, PlatformServerless, QueryParams, PlatformServerlessTest} from "@tsed/platform-serverless";
import {expect} from "chai";

@Injectable()
class TimeslotsService {
  get() {
    return "test";
  }
}

@Injectable()
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

    expect(handlers).to.have.property("get");
    expect(handlers).to.have.property("byID");
  });

  it("should call lambda", async () => {
    const response = await PlatformServerlessTest.request.call("get").query({
      start_date: new Date("2020-01-01"),
      end_date: new Date("2020-01-10")
    });

    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.deep.equal({
      endDate: "2020-01-10T00:00:00.000Z",
      startDate: "2020-01-01T00:00:00.000Z",
      value: "test"
    });

    PlatformServerlessTest;
  });
});
