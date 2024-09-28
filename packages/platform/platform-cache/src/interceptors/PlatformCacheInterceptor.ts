import {isClass, isString, nameOf} from "@tsed/core";
import {BaseContext, Constant, DIContext, Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";
import {Logger} from "@tsed/logger";
import {IncomingMessage, ServerResponse} from "http";

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

/**
 * @platform
 */
@Interceptor()
export class PlatformCacheInterceptor implements InterceptorMethods {
  @Inject()
  protected cache: PlatformCache;

  @Inject()
  protected logger: Logger;

  @Constant("cache.prefix", "")
  protected prefix: string;

  @Constant("cache.ignoreHeaders", ["content-length", "x-request-id", "cache-control", "vary", "content-encoding"])
  protected blacklist: string[];

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
      ttl
    }: {
      refreshThreshold?: number;
      ttl: any;
    },
    next: Function
  ) {
    const inQueue = await this.hasKeyInQueue(key);

    if (refreshThreshold && !inQueue) {
      await this.addKeyToQueue(key);

      const currentTTL = await this.cache.ttl(key);
      const calculatedTTL = this.cache.calculateTTL(currentTTL, ttl);

      if (currentTTL === undefined || currentTTL < calculatedTTL - refreshThreshold) {
        await next();
      }

      await this.deleteKeyFromQueue(key);
    }
  }

  async cacheMethod(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {key, type, ttl, collectionType, refreshThreshold, args, canCache} = this.getOptions(context);

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

    this.canRefreshInBackground(key, {refreshThreshold, ttl}, async () => {
      const result = await next();

      await set(result);
    }).catch((er) =>
      this.logger.error({
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

  async cacheResponse(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {request, response} = context.args[context.args.length - 1];

    if (request.method !== "GET") {
      return next();
    }

    const {key, ttl, args, $ctx} = this.getOptions(context);

    const cachedObject = await this.cache.getCachedObject(key);

    if (cachedObject && !(request.get("cache-control") === "no-cache")) {
      return this.sendResponse(cachedObject, $ctx);
    }

    const result = await next();

    const calculatedTTL = this.cache.calculateTTL(result, ttl);

    $ctx.response.setHeaders({
      "cache-control": `max-age=${calculatedTTL}`
    });

    // cache final response with his headers and body
    response.onEnd(() => {
      this.cache.setCachedObject(key, response.getBody(), {
        ttl: calculatedTTL,
        args,
        headers: cleanHeaders(response.getHeaders(), this.blacklist)
      });
    });

    return result;
  }

  protected getArgs(context: InterceptorContext<unknown, PlatformCacheOptions>) {
    return context.args.reduce((args, arg) => {
      if (arg instanceof DIContext || arg instanceof IncomingMessage || arg instanceof ServerResponse) {
        return args;
      }

      if (isClass(arg)) {
        return args.concat(serialize(arg));
      }

      return args.concat(arg);
    }, []);
  }

  protected getOptions(context: InterceptorContext<any, PlatformCacheOptions>) {
    const $ctx = context.args[context.args.length - 1];

    const {ttl, type, collectionType, key: k = this.cache.defaultKeyResolver(), refreshThreshold} = context.options || {};

    let {canCache} = context.options || {};

    const args = this.getArgs(context);
    const keyArgs = isString(k) ? k : k(args, $ctx);

    if (canCache && canCache === "no-nullish") {
      canCache = (item: any) => ![null, undefined].includes(item);
    }

    return {
      key: [...[this.prefix, ...getPrefix(context.target, context.propertyKey)].filter(Boolean), keyArgs].join(":"),
      refreshThreshold,
      ttl,
      type,
      args,
      collectionType,
      keyArgs,
      canCache,
      $ctx
    };
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

  protected sendResponse(cachedObject: PlatformCachedObject, $ctx: BaseContext) {
    const {headers, ttl} = cachedObject;
    const {request, response} = $ctx;

    const requestEtag = request.get("if-none-match");

    if (requestEtag && headers.etag === requestEtag) {
      response.status(304).setHeaders(headers).body(undefined);

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

    return data;
  }
}
