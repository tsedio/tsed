import {Type} from "@tsed/core";
import {DITest} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {JsonEntityStore} from "@tsed/schema";
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler, Context} from "aws-lambda";
import {APIGatewayProxyResult} from "aws-lambda/trigger/api-gateway-proxy";
import {PlatformServerless} from "../builder/PlatformServerless";
import {ServerlessContext} from "../domain/ServerlessContext";

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

  static get(path: string, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    return this.call("handler").get(path, options);
  }

  static post(path: string, body?: any, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    return this.call("handler").post(path, body, options);
  }

  static put(path: string, body?: any, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    return this.call("handler").put(path, body, options);
  }

  static patch(path: string, body?: any, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    return this.call("handler").patch(path, body, options);
  }

  static delete(path: string, body?: any, options: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
    return this.call("handler").delete(path, body, options);
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
        requestId: "requestId",
        requestTimeEpoch: 0,
        resourceId: 1,
        resourcePath: event.path || "/"
      } as any
    } as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
  }

  static createFakeContext(context?: Context): Context {
    return {
      awsRequestId: "awsRequestId",
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
    this.event.httpMethod = "DELETE";

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

  headers(headers: Record<string, any>) {
    this.event.headers = {
      ...this.event.headers,
      ...JSON.parse(JSON.stringify(headers))
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
      const instance = PlatformServerless.bootstrap(DITest.configure(settings));
      PlatformServerlessTest.instance = instance;
      PlatformServerlessTest.callbacks = instance.callbacks();
      PlatformServerlessTest.callbacks.handler = instance.handler();
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

  static createServerlessContext({endpoint}: {endpoint: JsonEntityStore}) {
    const context: any = LambdaClientRequest.createFakeContext();
    const event: any = LambdaClientRequest.createFakeEvent();

    return new ServerlessContext({
      event,
      context,
      id: context.awsRequestId,
      logger: PlatformServerlessTest.injector.logger as Logger,
      injector: PlatformServerlessTest.injector,
      endpoint
    });
  }
}
