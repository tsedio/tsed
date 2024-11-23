import {pipeline} from "node:stream/promises";

import {AnyPromiseResult, AnyToPromise, isSerializable, isStream} from "@tsed/core";
import {BaseContext, inject, injectable, lazyInject, ProviderScope, runInContext, TokenProvider} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {serialize} from "@tsed/json-mapper";
import {DeserializerPipe, PlatformParams, ValidationPipe} from "@tsed/platform-params";

import {ServerlessContext} from "../domain/ServerlessContext.js";
import type {ServerlessEvent} from "../domain/ServerlessEvent.js";
import {ServerlessResponseStream} from "../domain/ServerlessResponseStream.js";
import {setResponseHeaders} from "../utils/setResponseHeaders.js";

export class PlatformServerlessHandler {
  protected params = inject(PlatformParams);

  createHandler(token: TokenProvider, propertyKey: string | symbol) {
    const promisedHandler = this.params.compileHandler({token, propertyKey});

    return ($ctx: ServerlessContext<ServerlessEvent>) => {
      return runInContext($ctx, async () => {
        await $asyncEmit("$onRequest", $ctx);

        try {
          const resolver = new AnyToPromise();
          const handler = await promisedHandler;
          const result = await resolver.call(() => handler({$ctx}));

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

    await $asyncEmit("$onResponse", $ctx);

    $ctx.logger.flush();
    $ctx.destroy();

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
