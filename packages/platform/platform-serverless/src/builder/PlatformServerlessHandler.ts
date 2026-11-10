import {AnyPromiseResult, AnyToPromise, isPromise, isSerializable, isStream} from "@tsed/core";
import {BaseContext, ProviderScope, TokenProvider, inject, injectable, lazyInject, runInContext} from "@tsed/di";
import {DeserializerPipe, PlatformParams, ValidationPipe} from "@tsed/platform-params";
import {$asyncEmit, hooks} from "@tsed/hooks";
import {ServerlessContext} from "../domain/ServerlessContext.js";
import type {ServerlessEvent} from "../domain/ServerlessEvent.js";
import {ServerlessResponseStream} from "../domain/ServerlessResponseStream.js";
import {pipeline} from "node:stream/promises";
import {serialize} from "@tsed/json-mapper";
import {setResponseHeaders} from "../utils/setResponseHeaders.js";

export class PlatformServerlessHandler {
  protected params = inject(PlatformParams);

  createHandler(token: TokenProvider, propertyKey: string | symbol) {
    const promisedHandler = this.params.compileHandler({token, propertyKey});

    return ($ctx: ServerlessContext<ServerlessEvent>) => {
      return runInContext($ctx, async () => {
        try {
          if (hooks.has("$onRequest")) {
            await $asyncEmit("$onRequest", [$ctx]);
          }

          // a synchronous endpoint is classified without waiting for a promise
          const handler = promisedHandler;
          const response = new AnyToPromise().run(() => handler({$ctx}));
          const result = isPromise(response) ? await response : response;

          this.processResult(result, $ctx);
        } catch (er) {
          $ctx.response.status(500).body(er);
          const exceptions = await lazyInject(() => import("@tsed/platform-exceptions"));

          await exceptions.catch(er, $ctx as unknown as BaseContext);
        }

        return this.flush($ctx);
      });
    };
  }

  private async flush($ctx: ServerlessContext<ServerlessEvent>) {
    const body: unknown = $ctx.isHttpEvent() && !$ctx.isAuthorizerEvent() ? await this.makeHttpResponse($ctx) : $ctx.response.getBody();

    try {
      if (hooks.has("$onResponse")) {
        await $asyncEmit("$onResponse", [$ctx]);
      }
    } finally {
      $ctx.logger.flush();
      $ctx.destroy();
    }

    if (!$ctx.isHttpEvent() && $ctx.response.statusCode >= 400 && body) {
      throw new Error((body as Error).message);
    }

    return body;
  }

  private async makeHttpResponse($ctx: ServerlessContext<ServerlessEvent>) {
    setResponseHeaders($ctx);

    let body = $ctx.response.getBody();

    if (isSerializable(body)) {
      $ctx.response.set("content-type", "application/json");
      body = JSON.stringify(body);
    }

    const meta = {
      statusCode: $ctx.response.getStatus(),
      headers: {
        ...$ctx.response.getHeaders(),
        "x-request-id": $ctx.id
      }
    };

    if (isStream(body) && $ctx.responseStream) {
      const resStream = ServerlessResponseStream.setMeta($ctx.responseStream, {
        ...meta,
        headers: {
          "content-type": "application/octet-stream",
          ...meta.headers
        }
      });

      await pipeline(body, resStream);

      return undefined;
    }

    return {
      ...meta,
      body: body === undefined ? "" : body,
      isBase64Encoded: false
    };
  }

  private processResult({status, headers, data}: AnyPromiseResult, $ctx: ServerlessContext<ServerlessEvent>) {
    if (status) {
      $ctx.response.status(status);
    }

    if (headers) {
      $ctx.response.setHeaders(headers);
    }

    if (data !== undefined) {
      data = $ctx.response.getStatus() !== 204 ? data : "";

      if (isSerializable(data)) {
        data = serialize(data, {
          ...$ctx.endpoint.getResponseOptions($ctx.response.getStatus()),
          useAlias: true,
          endpoint: true
        });
      }

      $ctx.response.body(data);
    }
  }
}

injectable(PlatformServerlessHandler).scope(ProviderScope.SINGLETON).imports([DeserializerPipe, ValidationPipe]);
