import {nameOf, Type} from "@tsed/core";
import {destroyInjector, DITest} from "@tsed/di";
import type {PlatformBuilder, PlatformBuilderSettings} from "@tsed/platform-http";
import type {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";

import {createFakeContext} from "./createFakeContext.js";
import {createFakeEvent} from "./createFakeEvent.js";

export interface LambdaPromiseResult extends Promise<APIGatewayProxyResult> {}

export class LambdaClientRequest extends Promise<APIGatewayProxyResult> {
  event = createFakeEvent();
  context = createFakeContext();

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
  static instance: any;
  static request = LambdaClientRequest;

  static bootstrap(
    serverless: {bootstrap: (server: Type<any>, settings: TsED.Configuration) => PlatformBuilder},
    {server, ...settings}: PlatformBuilderSettings<any> & {server: Type<any>}
  ): () => Promise<any>;
  static bootstrap(
    serverless: {bootstrap: (settings: Partial<TsED.Configuration> & {lambda?: Type[]}) => any},
    {server, ...settings}: PlatformBuilderSettings<any>
  ): () => Promise<any>;
  static bootstrap(serverless: any, {server, ...settings}: PlatformBuilderSettings<any>) {
    return function before(): Promise<void> {
      settings = DITest.configure(settings);

      const isServerlessHttp = nameOf(serverless).includes("Http");

      // @ts-ignore
      const instance = isServerlessHttp ? serverless.bootstrap(server, settings) : serverless.bootstrap(settings);

      PlatformServerlessTest.instance = instance;
      PlatformServerlessTest.callbacks = {};

      if (!isServerlessHttp) {
        PlatformServerlessTest.callbacks = instance.callbacks();
      }

      PlatformServerlessTest.callbacks.handler = instance.handler();

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

    await destroyInjector();
  }
}
