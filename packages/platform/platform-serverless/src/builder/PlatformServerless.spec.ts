import {Controller, Inject, Injectable} from "@tsed/di";
import {BodyParams, Delete, Get, Patch, PathParams, PlatformServerless, Post, Put, QueryParams} from "@tsed/platform-serverless";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";

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

  @(Get("/:id").Name("byID"))
  getByID(@PathParams("id") id: string) {
    return {
      id
    };
  }

  @Get("/")
  get(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    return {
      value: this.timeslotsService.get(),
      startDate,
      endDate
    };
  }

  @Post("/")
  post(@BodyParams() body: any) {
    return body;
  }

  @Put("/:id")
  put(@BodyParams() body: any) {
    return body;
  }

  @Patch("/:id")
  patch(@BodyParams() body: any) {
    return body;
  }

  @Delete("/:id")
  delete(@BodyParams() body: any) {
    return body;
  }

  other() {}
}

describe("PlatformServerless", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
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

  it("should call lambda from handler()", async () => {
    const response = await PlatformServerlessTest.request.get("/").query({
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

  it("should call lambda from handler() with params", async () => {
    const response = await PlatformServerlessTest.request.get("/1");

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      id: "1"
    });
  });

  it("should call lambda from handler() (post)", async () => {
    const response = await PlatformServerlessTest.request.post("/").body({
      label: "label"
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      label: "label"
    });
  });

  it("should call lambda from handler() (put)", async () => {
    const response = await PlatformServerlessTest.request.put("/1").body({
      label: "label"
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      label: "label"
    });
  });

  it("should call lambda from handler() (patch)", async () => {
    const response = await PlatformServerlessTest.request.patch("/1").body({
      label: "label"
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      label: "label"
    });
  });

  it("should call lambda from handler() (delete)", async () => {
    const response = await PlatformServerlessTest.request.delete("/1").body({
      label: "label"
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual({
      label: "label"
    });
  });
});
