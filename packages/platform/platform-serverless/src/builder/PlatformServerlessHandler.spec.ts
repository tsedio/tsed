import {DITest, Inject, Injectable} from "@tsed/di";
import {QueryParams} from "@tsed/platform-params";
import {JsonEntityStore} from "@tsed/schema";
import {ServerlessContext} from "../domain/ServerlessContext.js";
import {PlatformServerlessHandler} from "./PlatformServerlessHandler.js";

async function getPlatformServerlessHandlerFixture() {
  const service = await DITest.invoke<PlatformServerlessHandler>(PlatformServerlessHandler);
  return {
    service
  };
}

@Injectable()
class TimeslotsService {
  get() {
    return "test";
  }
}

@Injectable()
export class TimeslotsLambdaController {
  @Inject()
  protected timeslotsService: TimeslotsService;

  get(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    return {
      value: this.timeslotsService.get(),
      startDate,
      endDate
    };
  }
}

describe("PlatformServerlessHandler", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should call lambda provider", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = JsonEntityStore.fromMethod(TimeslotsLambdaController, "get");
    const $ctx = new ServerlessContext({
      event: {
        headers: {
          "Content-Type": "application/json"
        }
      } as any,
      context: {} as any,
      endpoint
    } as any);

    const handler = await service.createHandler(TimeslotsLambdaController, "get");
    const result = await handler($ctx);

    expect(result).toEqual({
      body: '{"value":"test"}',
      headers: {
        "content-type": "application/json"
      },
      isBase64Encoded: false,
      statusCode: 200
    });
  });
});
