import {DITest, Inject, Injectable} from "@tsed/di";
import type {APIGatewayTokenAuthorizerEvent} from "aws-lambda";
import {PlatformServerlessHandler} from "./PlatformServerlessHandler.js";
import {QueryParams} from "@tsed/platform-params";
import {ServerlessContext} from "../domain/ServerlessContext.js";
import {Unauthorized} from "@tsed/exceptions";
import {catchAsyncError} from "@tsed/core";
import {$off, $on} from "@tsed/hooks";
import {s} from "@tsed/schema";

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

  throwError(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    throw new Unauthorized("Unauthorized");
  }
}

describe("PlatformServerlessHandler", () => {
  beforeEach(() => DITest.create({}));
  afterEach(() => DITest.reset());

  it("should call lambda provider and return http response", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = s.store.method(TimeslotsLambdaController, "get");
    const $ctx = new ServerlessContext({
      event: {
        httpMethod: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      } as any,
      context: {} as any,
      endpoint
    } as any);

    const handler = service.createHandler(TimeslotsLambdaController, "get");
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
  it("should call the $onRequest and $onResponse listeners with the context", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();
    const ref = Symbol("ref");
    const onRequest = vi.fn();
    const onRequestWithRef = vi.fn();
    const onResponse = vi.fn();
    const onResponseWithRef = vi.fn();

    $on("$onRequest", onRequest);
    $on("$onRequest", ref, onRequestWithRef);
    $on("$onResponse", onResponse);
    $on("$onResponse", ref, onResponseWithRef);

    try {
      const endpoint = s.store.method(TimeslotsLambdaController, "get");
      const $ctx = new ServerlessContext({
        event: {
          httpMethod: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        } as any,
        context: {} as any,
        endpoint
      } as any);

      const handler = service.createHandler(TimeslotsLambdaController, "get");
      await handler($ctx);

      expect(onRequest).toHaveBeenCalledWith($ctx);
      expect(onRequestWithRef).toHaveBeenCalledWith($ctx);
      expect(onResponse).toHaveBeenCalledWith($ctx);
      expect(onResponseWithRef).toHaveBeenCalledWith($ctx);
    } finally {
      $off("$onRequest", onRequest);
      $off(ref);
      $off("$onResponse", onResponse);
    }
  });
  it("shouldn't throw error and return http response", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = s.store.method(TimeslotsLambdaController, "throwError");
    const $ctx = new ServerlessContext({
      event: {
        httpMethod: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      } as any,
      context: {} as any,
      endpoint,
      injector: DITest.injector
    } as any);

    const handler = service.createHandler(TimeslotsLambdaController, "throwError");

    const result = await handler($ctx);

    expect(result).toEqual({
      body: '{"name":"UNAUTHORIZED","message":"Unauthorized","status":401,"errors":[]}',
      headers: {
        "content-type": "application/json"
      },
      isBase64Encoded: false,
      statusCode: 401
    });
  });
  it("should call lambda provider and return raw response when isn't a http event", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = s.store.method(TimeslotsLambdaController, "get");
    const $ctx = new ServerlessContext({
      event: {
        type: "TOKEN",
        methodArn: "",
        authorizationToken: ""
      } as APIGatewayTokenAuthorizerEvent,
      context: {} as any,
      endpoint
    } as any);

    const handler = service.createHandler(TimeslotsLambdaController, "get");
    const result = await handler($ctx);

    expect(result).toEqual({
      value: "test"
    });
  });
  it("should throw error when isn't a http event", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = s.store.method(TimeslotsLambdaController, "throwError");
    const $ctx = new ServerlessContext({
      event: {
        type: "TOKEN",
        methodArn: "",
        authorizationToken: ""
      } as APIGatewayTokenAuthorizerEvent,
      context: {} as any,
      endpoint,
      injector: DITest.injector
    } as any);

    const handler = service.createHandler(TimeslotsLambdaController, "throwError");

    const result = await catchAsyncError<Error>(() => handler($ctx));

    expect(result?.message).toEqual("Unauthorized");
  });
});
