import {catchAsyncError} from "@tsed/core";
import {DITest, Inject, Injectable} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {QueryParams} from "@tsed/platform-params";
import {JsonEntityStore} from "@tsed/schema";
import type {APIGatewayTokenAuthorizerEvent} from "aws-lambda";

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

  throwError(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    throw new Unauthorized("Unauthorized");
  }
}

describe("PlatformServerlessHandler", () => {
  beforeEach(() => DITest.create({}));
  afterEach(() => DITest.reset());

  it("should call lambda provider and return http response", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = JsonEntityStore.fromMethod(TimeslotsLambdaController, "get");
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
  it("shouldn't throw error and return http response", async () => {
    const {service} = await getPlatformServerlessHandlerFixture();

    const endpoint = JsonEntityStore.fromMethod(TimeslotsLambdaController, "throwError");
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

    const endpoint = JsonEntityStore.fromMethod(TimeslotsLambdaController, "get");
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

    const endpoint = JsonEntityStore.fromMethod(TimeslotsLambdaController, "throwError");
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
