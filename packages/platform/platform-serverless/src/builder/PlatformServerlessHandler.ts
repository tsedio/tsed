import {AnyPromiseResult, AnyToPromise, isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {BaseContext, Inject, Injectable, InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {DeserializerPipe, PlatformParams, ValidationPipe} from "@tsed/platform-params";
import {ServerlessContext} from "../domain/ServerlessContext";
import {setResponseHeaders} from "../utils/setResponseHeaders";

function shouldBeSent(data: any) {
  return Buffer.isBuffer(data) || isBoolean(data) || isNumber(data) || isString(data) || data === null;
}

function shouldBeSerialized(data: any) {
  return !(isStream(data) || shouldBeSent(data) || data === undefined);
}

@Injectable({
  scope: ProviderScope.SINGLETON,
  imports: [DeserializerPipe, ValidationPipe]
})
export class PlatformServerlessHandler {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected params: PlatformParams;

  @Inject()
  protected exceptions: PlatformExceptions;

  createHandler(token: TokenProvider, propertyKey: string | symbol) {
    const promisedHandler = this.params.compileHandler({
      token,
      propertyKey
    });

    return async ($ctx: ServerlessContext) => {
      await this.injector.emit("$onRequest", $ctx);

      await this.injector.runInContext($ctx, async () => {
        try {
          const resolver = new AnyToPromise();
          const handler = await promisedHandler;
          const result = await resolver.call(() => handler({$ctx}));

          this.processResult(result, $ctx);
        } catch (er) {
          $ctx.response.status(500).body(er);
          await this.exceptions.catch(er, ($ctx as unknown) as BaseContext);
        }
      });

      await this.injector.emit("$onResponse", $ctx);

      return this.flush($ctx);
    };
  }

  private flush($ctx: ServerlessContext) {
    setResponseHeaders($ctx);

    let body: any = $ctx.response.getBody();

    if (shouldBeSerialized(body)) {
      $ctx.response.set("content-type", "application/json");
      body = JSON.stringify(body);
    }

    const response = {
      statusCode: $ctx.response.getStatus(),
      body: body === undefined ? "" : body,
      headers: {
        ...$ctx.response.getHeaders(),
        "x-request-id": $ctx.id
      },
      isBase64Encoded: false
    };

    $ctx.destroy();

    return response;
  }

  private processResult({status, headers, data}: AnyPromiseResult, $ctx: ServerlessContext) {
    if (status) {
      $ctx.response.status(status);
    }

    if (headers) {
      $ctx.response.setHeaders(headers);
    }

    if (data !== undefined) {
      data = $ctx.response.getStatus() !== 204 ? data : "";

      if (shouldBeSerialized(data)) {
        data = serialize(data, {
          ...$ctx.endpoint.getResponseOptions()
        });
      }

      $ctx.response.body(data);
    }
  }
}
