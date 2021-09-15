import {Type} from "@tsed/core";
import {DITest} from "@tsed/di";
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler, Context} from "aws-lambda";
import {APIGatewayProxyResult} from "aws-lambda/trigger/api-gateway-proxy";
import {PlatformServerless} from "../builder/PlatformServerless";

export interface LambdaPromiseResult extends Promise<APIGatewayProxyResult> {}

export class LambdaClientRequest extends Promise<APIGatewayProxyResult> {
  event = LambdaClientRequest.createFakeEvent();
  context = LambdaClientRequest.createFakeContext();

  static call(lambdaName: string) {
    const resolvers: any = {};
    const promise = new LambdaClientRequest((resolve, reject) => {
      resolvers.resolve = resolve;
      resolvers.reject = reject;
    });

    promise.init(lambdaName, resolvers.resolve, resolvers.reject);

    return promise;
  }

  static createFakeEvent(event: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    return {
      body: "",
      headers: {},
      httpMethod: "",
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      path: event.path || "/",
      pathParameters: {},
      queryStringParameters: {},
      resource: "",
      stageVariables: {},
      ...event,
      requestContext: {
        ...event?.requestContext,
        accountId: "",
        apiId: "",
        protocol: "https",
        httpMethod: "",
        identity: {} as any,
        path: event.path || "/",
        stage: "",
        requestId: "",
        requestTimeEpoch: 0,
        resourceId: 1,
        resourcePath: event.path || "/"
      } as any
    } as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
  }

  static createFakeContext(context?: Context): Context {
    return {
      awsRequestId: "",
      callbackWaitsForEmptyEventLoop: false,
      functionName: "",
      functionVersion: "",
      invokedFunctionArn: "",
      logGroupName: "",
      logStreamName: "",
      memoryLimitInMB: "",
      ...(context || {})
    } as Context;
  }

  get(path: string, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    Object.assign(this.event, options);

    this.event.path = path;
    this.event.httpMethod = "GET";

    return this;
  }

  post(path: string, body: any = {}, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    Object.assign(this.event, options);

    this.event.path = path;
    this.event.httpMethod = "POST";

    this.body(body);

    return this;
  }

  patch(path: string, body: any = {}, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    Object.assign(this.event, options);

    this.event.path = path;
    this.event.httpMethod = "PATCH";

    this.body(body);

    return this;
  }

  put(path: string, body: any = {}, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    Object.assign(this.event, options);

    this.event.path = path;
    this.event.httpMethod = "PUT";

    this.body(body);

    return this;
  }

  delete(path: string, body: any = {}, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    Object.assign(this.event, options);

    this.event.path = path;
    this.event.httpMethod = "POST";

    this.body(body);

    return this;
  }

  query(query: any) {
    this.event.queryStringParameters = {
      ...this.event.queryStringParameters,
      ...JSON.parse(JSON.stringify(query))
    };

    return this;
  }

  params(pathParameters: any) {
    this.event.pathParameters = {
      ...this.event.pathParameters,
      ...JSON.parse(JSON.stringify(pathParameters))
    };

    return this;
  }

  body(body: any) {
    if (body !== undefined) {
      this.event.headers["content-type"] = "application/json";

      this.event.body = JSON.stringify(body);
    }

    return this;
  }

  protected init(lambda: string, resolve: Function, reject: Function) {
    setTimeout(async () => {
      try {
        const result = await PlatformServerlessTest.callbacks[lambda](this.event, this.context, resolve as any);
        resolve(result as any);
      } catch (er) {
        reject(er);
      }
    });
  }
}

export class PlatformServerlessTest extends DITest {
  static callbacks: Record<string, APIGatewayProxyHandler> = {};
  static instance: PlatformServerless;
  static request = LambdaClientRequest;

  static bootstrap(settings: Partial<TsED.Configuration & {lambda: Type[]}> = {}) {
    return async function before(): Promise<void> {
      // @ts-ignore
      const instance = await PlatformServerless.bootstrap(DITest.configure(settings));
      PlatformServerlessTest.instance = instance;
      PlatformServerlessTest.callbacks = instance.callbacks();
      // used by inject method
      DITest.injector = instance.injector;

      return instance.promise;
    };
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    if (PlatformServerlessTest.instance) {
      await PlatformServerlessTest.instance.stop();
    }
    if (DITest.hasInjector()) {
      await DITest.injector.destroy();
      DITest._injector = null;
    }
  }
}
