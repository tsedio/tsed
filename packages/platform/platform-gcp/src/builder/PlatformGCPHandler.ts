import {pipeline} from "node:stream/promises";

import {AnyPromiseResult, AnyToPromise, isSerializable, isStream} from "@tsed/core";
import {BaseContext, inject, injectable, lazyInject, ProviderScope, runInContext, TokenProvider} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {serialize} from "@tsed/json-mapper";
import {DeserializerPipe, PlatformParams, ValidationPipe} from "@tsed/platform-params";

import {GCPContext} from "../domain/GCPContext.js";
import type {GCPHttpEvent} from "../domain/GCPEvent.js";
import {setResponseHeaders} from "../utils/setResponseHeaders.js";

export class PlatformGCPHandler {
  protected params = inject(PlatformParams);

  createHandler(token: TokenProvider, propertyKey: string | symbol) {
    const promisedHandler = this.params.compileHandler({token, propertyKey});

    return ($ctx: GCPContext) => {
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

  private async flush($ctx: GCPContext) {
    setResponseHeaders($ctx);

    if ($ctx.isHttpEvent()) {
      const event = $ctx.event as GCPHttpEvent;

      event.res.status($ctx.response.statusCode);

      Object.entries($ctx.response.getHeaders()).forEach(([key, value]) => {
        if (value !== undefined) {
          event.res.setHeader(key, value as any);
        }
      });

      let body = $ctx.response.getBody();

      if (isSerializable(body)) {
        $ctx.response.set("content-type", "application/json");
        body = JSON.stringify(body);
      }

      // If we have a stream and a response stream, pipe the stream to the response
      if (isStream(body) && $ctx.responseStream) {
        await pipeline(body, $ctx.responseStream);
        return undefined;
      }

      // If we have a body, send it
      if (body !== undefined) {
        $ctx.event.res.send(body);
      }
    }

    await $asyncEmit("$onResponse", $ctx);

    $ctx.logger.flush();
    $ctx.destroy();

    if (!$ctx.isHttpEvent() && $ctx.response.statusCode >= 400 && $ctx.response.getBody()) {
      throw new Error(($ctx.response.getBody() as Error).message);
    }
  }

  private processResult({status, headers, data}: AnyPromiseResult, $ctx: GCPContext) {
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

injectable(PlatformGCPHandler).scope(ProviderScope.SINGLETON).imports([DeserializerPipe, ValidationPipe]);
