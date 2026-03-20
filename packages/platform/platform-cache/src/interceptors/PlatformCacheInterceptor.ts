import {IncomingMessage, ServerResponse} from "node:http";

import {isClass, isString, nameOf} from "@tsed/core";
import {
  type BaseContext,
  constant,
  context,
  DIContext,
  inject,
  interceptor,
  InterceptorContext,
  InterceptorMethods,
  InterceptorNext,
  logger,
  runInContext
} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";

import {PlatformCachedObject} from "../interfaces/PlatformCachedObject.js";
import {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions.js";
import {PlatformCache} from "../services/PlatformCache.js";
import {getPrefix} from "../utils/getPrefix.js";
import {isEndpoint} from "../utils/isEndpoint.js";

const cleanHeaders = (headers: Record<string, unknown>, blacklist: string[]) => {
  return Object.entries(headers)
    .filter(([key]) => !blacklist.includes(key.toLowerCase()))
    .reduce((headers, [key, value]) => {
      return {
        ...headers,
        [key]: value
      };
    }, {});
};

interface Response {
  setHeader(key: string, value: string): this;

  setHeaders(headers: Record<string, unknown>): this;

  body(data: unknown): this;

  status(status: number): this;

  onEnd(cb: any): void;

  getBody(): unknown;

  getHeaders(): Record<string, unknown>;
}

type Context = DIContext & {
  request?: {
    get(key: string): string | undefined;
    method: string;
  };
  response?: Response;
};

/**
 * @platform
 */
export class PlatformCacheInterceptor implements InterceptorMethods {
  static #refreshLocks = new Map<string, Promise<void>>();

  protected cache = inject(PlatformCache);

  protected prefix = constant<string>("cache.prefix", "");

  protected blacklist = constant<string[]>("cache.ignoreHeaders", [
    "content-length",
    "x-request-id",
    "cache-control",
    "vary",
    "content-encoding"
  ]);

  intercept(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    if (this.cache.disabled()) {
      return next();
    }

    if (!isEndpoint(context.target, context.propertyKey)) {
      return this.cacheMethod(context, next);
    }

    return this.cacheResponse(context, next);
  }

  async canRefreshInBackground(
    key: string,
    {
      refreshThreshold,
      ttl,
      cachedTTL
    }: {
      refreshThreshold?: number;
      ttl: any;
      cachedTTL?: number;
    },
    next: Function,
    $ctx?: Context
  ) {
    if (!refreshThreshold) {
      return;
    }

    const release = await this.acquireRefreshLock(key);

    try {
      const inQueue = await this.hasKeyInQueue(key);
      const inCooldown = await this.hasRefreshCooldown(key);

      if (inQueue || inCooldown) {
        return;
      }

      await this.addKeyToQueue(key);

      const currentTTL = await this.cache.ttl(key);
      const calculatedTTL = cachedTTL ?? (typeof ttl === "number" ? ttl : undefined);
      const refreshThresholdWithJitter = this.getRefreshThresholdWithJitter(key, refreshThreshold);

      try {
        if (calculatedTTL !== undefined && (currentTTL === undefined || currentTTL < calculatedTTL - refreshThresholdWithJitter)) {
          await this.addRefreshCooldown(key, refreshThresholdWithJitter);

          if ($ctx) {
            await runInContext($ctx, () => next());
          } else {
            await next();
          }
        }
      } finally {
        await this.deleteKeyFromQueue(key);
      }
    } finally {
      release();
    }
  }

  async cacheMethod(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {key, type, ttl, collectionType, refreshThreshold, args, canCache, $ctx, byPass} = this.getOptions(context, false);

    if (this.shouldByPassCache(byPass, args, $ctx)) {
      return next();
    }

    const set = (result: any) => {
      if (!canCache || (canCache && canCache(result))) {
        const calculatedTTL = this.cache.calculateTTL(result, ttl);
        const data = serialize(result, {type, collectionType});
        this.cache.setCachedObject(key, data, {args, ttl: calculatedTTL});
      }
    };

    const cachedObject = await this.cache.getCachedObject(key);

    if (!cachedObject || this.cache.isForceRefresh()) {
      const result = await next();

      if (!(!cachedObject && this.cache.isForceRefresh())) {
        set(result);
      }

      return result;
    }

    this.canRefreshInBackground(
      key,
      {refreshThreshold, ttl, cachedTTL: cachedObject.ttl},
      async () => {
        const result = await next();

        await set(result);
      },
      $ctx
    ).catch((er) =>
      logger().error({
        event: "CACHE_ERROR",
        method: "cacheMethod",
        concerned_key: key,
        class_name: nameOf(context.target),
        property_key: context.propertyKey,
        error_description: er.message,
        stack: er.stack
      })
    );

    const {data} = cachedObject;

    return deserialize(JSON.parse(data), {collectionType, type});
  }

  async cacheResponse(interceptorContext: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {key, ttl, args, $ctx, byPass} = this.getOptions(interceptorContext, "no-cache");
    const currentCtx = $ctx || context<Context>();

    if (this.getMethod(currentCtx) !== "GET") {
      return next();
    }

    const shouldByPass = this.shouldByPassCache(byPass, args, currentCtx);
    const useCache = !shouldByPass;

    if (useCache) {
      const cachedObject = await this.cache.getCachedObject(key);

      if (cachedObject) {
        return this.sendResponse(cachedObject);
      }
    }

    const result = await next();
    const calculatedTTL = this.cache.calculateTTL(result, ttl);

    currentCtx.response?.setHeaders({
      "cache-control": `max-age=${calculatedTTL}`
    });

    currentCtx.response?.onEnd(() => {
      if (!useCache) {
        return;
      }

      this.cache.setCachedObject(key, currentCtx.response!.getBody(), {
        ttl: calculatedTTL,
        args,
        headers: cleanHeaders(currentCtx.response!.getHeaders(), this.blacklist)
      });
    });

    return result;
  }

  protected getMethod($ctx = context<Context>()) {
    return $ctx.request?.method;
  }

  protected noCache($ctx = context<Context>()) {
    return $ctx.request?.get("cache-control") === "no-cache" || $ctx.get("cache-control") === "no-cache";
  }

  protected getArgs(context: InterceptorContext<unknown, PlatformCacheOptions>): unknown[] {
    return context.args.reduce((args: unknown[], arg) => {
      if (arg instanceof DIContext || arg instanceof IncomingMessage || arg instanceof ServerResponse) {
        return args;
      }

      if (isClass(arg)) {
        return args.concat(serialize(arg));
      }

      return args.concat(arg);
    }, [] as unknown[]) as unknown[];
  }

  protected getOptions(
    interceptorContext: InterceptorContext<any, PlatformCacheOptions>,
    defaultByPass: PlatformCacheOptions["byPass"] = false
  ) {
    const $ctx = this.getContextFromArgs(interceptorContext.args) || context<Context>();

    const {
      ttl,
      type,
      collectionType,
      key: k = this.cache.defaultKeyResolver(),
      refreshThreshold,
      byPass = defaultByPass
    } = interceptorContext.options || {};

    let {canCache} = interceptorContext.options || {};

    const args = this.getArgs(interceptorContext);
    const keyArgs = isString(k) ? k : k(args as any[], $ctx as any);

    if (canCache && canCache === "no-nullish") {
      canCache = (item: any) => ![null, undefined].includes(item);
    }

    return {
      key: [...[this.prefix, ...getPrefix(interceptorContext.target, interceptorContext.propertyKey)].filter(Boolean), keyArgs].join(":"),
      refreshThreshold,
      ttl,
      type,
      args,
      collectionType,
      keyArgs,
      canCache,
      $ctx,
      byPass
    };
  }

  protected getContextFromArgs(args: unknown[]): Context | undefined {
    return args.find((arg): arg is Context => arg instanceof DIContext);
  }

  protected shouldByPassCache(byPass: PlatformCacheOptions["byPass"], args: unknown[], $ctx?: Context) {
    if (!byPass) {
      return false;
    }

    if (byPass === "no-cache") {
      return this.noCache($ctx);
    }

    return typeof byPass === "function" ? byPass(args as any[], $ctx as BaseContext) : !!byPass;
  }

  protected async hasKeyInQueue(key: string) {
    return !!(await this.cache.get(`$$queue:${key}`));
  }

  protected async addKeyToQueue(key: string) {
    await this.cache.set(`$$queue:${key}`, true, {ttl: 120});
  }

  protected async deleteKeyFromQueue(key: string) {
    await this.cache.del(`$$queue:${key}`);
  }

  protected async acquireRefreshLock(key: string) {
    for (;;) {
      const lock = PlatformCacheInterceptor.#refreshLocks.get(key);

      if (!lock) {
        let releaseFn: (() => void) | undefined;
        const currentLock = new Promise<void>((resolve) => {
          releaseFn = resolve;
        });

        PlatformCacheInterceptor.#refreshLocks.set(key, currentLock);

        return () => {
          if (PlatformCacheInterceptor.#refreshLocks.get(key) === currentLock) {
            PlatformCacheInterceptor.#refreshLocks.delete(key);
          }

          releaseFn?.();
        };
      }

      await lock;
    }
  }

  protected getRefreshCooldownKey(key: string) {
    return `$$refresh-cooldown:${key}`;
  }

  protected getRefreshThresholdWithJitter(key: string, refreshThreshold: number) {
    const maxJitter = Math.max(1, Math.floor(refreshThreshold * 0.1));
    const hash = key.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
    const jitter = Math.abs(hash) % (maxJitter + 1);

    return Math.max(1, refreshThreshold - jitter);
  }

  protected async hasRefreshCooldown(key: string) {
    return !!(await this.cache.get(this.getRefreshCooldownKey(key)));
  }

  protected async addRefreshCooldown(key: string, refreshThreshold: number) {
    const cooldownTTL = Math.max(1, Math.floor(refreshThreshold / 2));

    await this.cache.set(this.getRefreshCooldownKey(key), true, {ttl: cooldownTTL});
  }

  protected sendResponse(cachedObject: PlatformCachedObject) {
    const {headers, ttl} = cachedObject;
    const $ctx = context<Context>();
    if ($ctx.request && $ctx.response) {
      const requestEtag = $ctx.request.get("if-none-match");

      if (requestEtag && headers?.etag === requestEtag) {
        $ctx.response.status(304).setHeaders(headers).body(undefined);

        return undefined;
      }

      const data = JSON.parse(cachedObject.data);

      $ctx.response
        .setHeaders({
          ...headers,
          "x-cached": "true",
          "cache-control": `max-age=${ttl}`
        })
        .body(data);

      return cachedObject.data;
    }

    return cachedObject.data;
  }
}

interceptor(PlatformCacheInterceptor);
