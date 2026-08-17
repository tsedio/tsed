import {IncomingMessage, ServerResponse} from "node:http";
import {Readable} from "node:stream";
import {staticPlugin} from "@elysia/static";
import {Elysia} from "elysia";
import {accepts} from "elysia-accepts";
import {catchAsyncError, isFunction, Type} from "@tsed/core";
import {constant, inject, runInContext} from "@tsed/di";
import {
  adapter,
  createContext,
  PlatformAdapter,
  PlatformBuilder,
  PlatformContext,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/platform-http";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformLayer} from "@tsed/platform-router";
import {PlatformElysiaRequest} from "../services/PlatformElysiaRequest.js";
import {PlatformElysiaResponse} from "../services/PlatformElysiaResponse.js";
import {convertPath} from "../utils/convertPath.js";

declare global {
  namespace TsED {
    export interface Application extends Elysia {}
  }
}

/** Fetch-native Ts.ED adapter for Elysia. */
export class PlatformElysia extends PlatformAdapter<Elysia> {
  readonly NAME = "elysia";

  static create(settings: Partial<TsED.Configuration>): PlatformBuilder<Elysia>;
  static create(module: Type<any>, settings?: Partial<TsED.Configuration>): PlatformBuilder<Elysia>;
  static create(module: any, settings: Partial<TsED.Configuration> = {}): PlatformBuilder<Elysia> {
    const rootModule = isFunction(module) ? module : undefined;
    return new PlatformBuilder<Elysia>({
      rootModule,
      httpPort: false,
      httpsPort: false,
      ...(rootModule ? settings : module),
      adapter: PlatformElysia
    });
  }

  static bootstrap(settings: Partial<TsED.Configuration>): Promise<PlatformBuilder<Elysia>>;
  static bootstrap(module: Type<any>, settings?: Partial<TsED.Configuration>): Promise<PlatformBuilder<Elysia>>;
  static bootstrap(module: any, settings: Partial<TsED.Configuration> = {}): Promise<PlatformBuilder<Elysia>> {
    const rootModule = isFunction(module) ? module : undefined;
    return new PlatformBuilder<Elysia>({
      rootModule,
      ...(rootModule ? settings : module),
      adapter: PlatformElysia
    }).bootstrap();
  }

  createApp() {
    const app = constant<Elysia>("elysia.app") || new Elysia(constant("elysia", {}));
    app.use(accepts());

    return {
      app,
      fetch: app.handle.bind(app),
      callback: () => this.createNodeCallback(app)
    };
  }

  useContext() {
    const invoke = createContext();
    const rawApp: Elysia = this.app.getApp();

    rawApp.onRequest(async (context: any) => {
      if (constant("rawBody") && context.request.body) {
        context.rawBody = Buffer.from(await context.request.clone().arrayBuffer());
      }
      const $ctx = invoke({request: context, response: context});
      context.$ctx = $ctx;
      await $ctx.start();
    });
    rawApp.onAfterResponse(async (context: any) => {
      if (context.$ctx && !context.$ctx.isFinished()) {
        await context.$ctx.finish();
      }
    });
  }

  async mapLayers(layers: PlatformLayer[]) {
    const rawApp: any = this.app.getApp();
    for (const layer of layers) {
      if (layer.method === "statics") {
        await this.statics(layer.path as string, layer.opts as PlatformStaticsOptions);
        continue;
      }
      const {path, wildcard} = convertPath(layer.path);
      if (path instanceof RegExp) {
        throw new Error("Elysia does not support RegExp route paths; use named parameters instead.");
      }
      const route = layer.method === "use" ? "all" : layer.method.toLowerCase();
      if (typeof rawApp[route] !== "function") {
        throw new Error(`Unsupported Elysia route method: ${layer.method}`);
      }
      rawApp[route](path, this.compose(layer, wildcard));
    }
  }

  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    return async ($ctx: PlatformContext) => {
      $ctx.error = await catchAsyncError(() => runInContext($ctx, () => handler($ctx)));
      if ($ctx.error && metadata.type !== PlatformHandlerType.ERR_MIDDLEWARE) {
        throw $ctx.error;
      }
    };
  }

  bodyParser() {
    // Elysia parses request bodies before route handlers according to content type.
    return null;
  }

  async statics(endpoint: string, {root, ...options}: PlatformStaticsOptions) {
    const maxAge = typeof options.maxAge === "string" ? Number.parseInt(options.maxAge, 10) : options.maxAge;

    this.app.getApp().use(
      await staticPlugin({
        assets: root,
        prefix: endpoint,
        alwaysStatic: true,
        ...options,
        maxAge
      })
    );
    return this;
  }

  afterLoadRoutes() {
    const rawApp: any = this.app.getApp();
    rawApp.onError(({error, $ctx}: any) => {
      if (!$ctx) return;

      const platformExceptions = inject<PlatformExceptions>(PlatformExceptions);
      if (error?.code === "NOT_FOUND") {
        platformExceptions?.resourceNotFound($ctx);
      } else {
        $ctx.error = error;
        platformExceptions?.catch(error, $ctx);
      }

      return this.toResponse($ctx);
    });
  }

  private compose(layer: PlatformLayer, wildcard?: string) {
    return async (context: any) => {
      const $ctx: PlatformContext = context.$ctx;
      if (wildcard && context.params?.["*"] && !context.params[wildcard]) {
        context.params[wildcard] = context.params["*"];
      }
      return runInContext($ctx, async () => {
        for (const metadata of layer.handlers) {
          if ($ctx.isDone()) break;
          if (
            ($ctx.error && metadata.type === PlatformHandlerType.ERR_MIDDLEWARE) ||
            (!$ctx.error && metadata.type !== PlatformHandlerType.ERR_MIDDLEWARE)
          ) {
            try {
              await metadata.compiledHandler($ctx);
            } catch (error) {
              $ctx.error = error;
            }
          }
        }
        if ($ctx.error) throw $ctx.error;
        return this.toResponse($ctx);
      });
    };
  }

  private toResponse($ctx: PlatformContext) {
    const response = $ctx.response;
    const body = response.getBody();
    const headers = new Headers();

    Object.entries(response.getHeaders()).forEach(([key, value]) => {
      ([] as string[]).concat(value as any).forEach((item) => headers.append(key, String(item)));
    });

    if (body === undefined || body === null || response.statusCode === 204 || response.statusCode === 304) {
      return new Response(null, {status: response.statusCode, headers});
    }

    if (body instanceof Response) {
      return body;
    }

    if (body instanceof ReadableStream) {
      return new Response(body, {status: response.statusCode, headers});
    }

    if (Buffer.isBuffer(body) || typeof body === "string") {
      return new Response(body as unknown as BodyInit, {status: response.statusCode, headers});
    }

    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json; charset=utf-8");
    }
    return new Response(JSON.stringify(body), {status: response.statusCode, headers});
  }

  private createNodeCallback(app: Elysia) {
    return async (request: IncomingMessage, response: ServerResponse) => {
      const origin = `http://${request.headers.host || "localhost"}`;
      const body = ["GET", "HEAD"].includes(request.method || "") ? undefined : (Readable.toWeb(request) as any);
      const fetchRequest = new Request(new URL(request.url || "/", origin), {
        method: request.method,
        headers: request.headers as any,
        body,
        duplex: body ? "half" : undefined
      } as any);
      const result = await app.handle(fetchRequest);
      response.statusCode = result.status;
      result.headers.forEach((value, key) => response.setHeader(key, value));
      if (result.body) Readable.fromWeb(result.body as any).pipe(response);
      else response.end();
    };
  }
}

adapter(PlatformElysia, [
  {token: PlatformResponse, useClass: PlatformElysiaResponse},
  {token: PlatformRequest, useClass: PlatformElysiaRequest}
]);
