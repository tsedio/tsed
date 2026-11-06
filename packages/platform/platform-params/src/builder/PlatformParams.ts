import {isPromise} from "@tsed/core";
import {DIContext, injectable, injector, ProviderScope, TokenProvider} from "@tsed/di";
import {JsonMethodStore, JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamValidationError} from "../errors/ParamValidationError.js";
import {ParseExpressionPipe} from "../pipes/ParseExpressionPipe.js";

export type PlatformParamsScope<Context extends DIContext = DIContext> = {$ctx: Context} & Record<string, any>;
export type PlatformParamsCallback<Context extends DIContext = DIContext> = (scope: PlatformParamsScope<Context>) => Promise<any> | any;

/**
 * Platform Params abstraction layer.
 * @platform
 */

export class PlatformParams {
  getPipes(param: JsonParameterStore) {
    const get = (pipe: TokenProvider) => {
      return injector().providers.get(pipe)!.priority || 0;
    };

    const sort = (p1: TokenProvider, p2: TokenProvider) => (get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0);
    const map = (token: TokenProvider) => injector().get<PipeMethods>(token)!;

    return [ParseExpressionPipe, ...param.pipes.sort(sort)].map(map).filter(Boolean);
  }

  /**
   * Return a handler with injectable parameters
   * @param handlerMetadata
   */
  compileHandler<Context extends DIContext = DIContext>({
    propertyKey,
    token,
    handler
  }: {
    propertyKey?: string | symbol;
    token?: any;
    handler?: any;
  }): PlatformParamsCallback<Context> {
    if (!token || !propertyKey) {
      return (scope: PlatformParamsScope<Context>) => handler(scope.$ctx);
    }

    const inj = injector();
    const store = JsonMethodStore.fromMethod(token, propertyKey);
    const provider = inj.providers.get(token)!;
    const getInstance = (scope: PlatformParamsScope<Context>) =>
      inj.invoke<any>(token, {locals: provider.scope === ProviderScope.REQUEST ? scope.$ctx.container : undefined});

    if (!JsonParameterStore.getParams(store.target, store.propertyKey).length) {
      // No parameter to resolve: call the method without waiting for a promise, unless the instance is built asynchronously.
      return (scope: PlatformParamsScope<Context>) => {
        const instance = getInstance(scope);

        return isPromise(instance)
          ? instance.then((instance: any) => instance[propertyKey].call(instance, scope.$ctx))
          : instance[propertyKey].call(instance, scope.$ctx);
      };
    }

    const getArguments = this.compile<Context>(store);

    return async (scope: PlatformParamsScope<Context>) => {
      const [instance, args] = await Promise.all([getInstance(scope), getArguments(scope)]);

      return instance[propertyKey].call(instance, ...args, scope.$ctx);
    };
  }

  compile<Context extends DIContext = DIContext>(entity: JsonMethodStore): PlatformParamsCallback<Context> {
    const params = JsonParameterStore.getParams(entity.target, entity.propertyKey);
    const argsPipes = params.map((param) => {
      return {
        param,
        pipes: this.getPipes(param)
      };
    });

    return (scope: PlatformParamsScope<Context>) => {
      const promises = argsPipes.map(({param, pipes}) => this.getArg<Context>(scope, pipes, param));
      return Promise.all(promises);
    };
  }

  async getArg<Context extends DIContext = DIContext>(
    scope: PlatformParamsScope<Context>,
    pipes: PipeMethods[],
    param: JsonParameterStore
  ): Promise<any> {
    try {
      let value = scope;

      for await (const pipe of pipes) {
        value = await pipe.transform(value, param);
      }

      return value;
    } catch (er) {
      throw ParamValidationError.from(param, er);
    }
  }
}

injectable(PlatformParams).imports([ParseExpressionPipe]);
