import {isPromise, type MaybePromise} from "@tsed/core";
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
    const isRequestScoped = provider.scope === ProviderScope.REQUEST;
    const getInstance = (scope: PlatformParamsScope<Context>) =>
      inj.invoke<any>(token, {locals: isRequestScoped ? scope.$ctx.container : undefined});

    if (!JsonParameterStore.getParams(store.target, store.propertyKey).length) {
      // No parameter to resolve: call the method without waiting for a promise, unless the instance is built asynchronously.
      return (scope: PlatformParamsScope<Context>) => {
        const instance = getInstance(scope);

        return isPromise(instance)
          ? instance.then((resolved: any) => resolved[propertyKey](scope.$ctx))
          : instance[propertyKey](scope.$ctx);
      };
    }

    const resolveArgs = this.compileArgs<Context>(store);

    // The arguments are resolved in the same tick when every pipe returns a value: the method is then called directly.
    return (scope: PlatformParamsScope<Context>) => {
      const instance = getInstance(scope);

      if (isPromise(instance)) {
        return Promise.all([instance, resolveArgs(scope)]).then(([resolved, args]) => resolved[propertyKey](...args, scope.$ctx));
      }

      const args = resolveArgs(scope);

      return isPromise(args)
        ? args.then((resolved) => instance[propertyKey](...resolved, scope.$ctx))
        : instance[propertyKey](...args, scope.$ctx);
    };
  }

  compile<Context extends DIContext = DIContext>(entity: JsonMethodStore): PlatformParamsCallback<Context> {
    const resolveArgs = this.compileArgs<Context>(entity);

    return async (scope: PlatformParamsScope<Context>) => resolveArgs(scope);
  }

  async getArg<Context extends DIContext = DIContext>(
    scope: PlatformParamsScope<Context>,
    pipes: PipeMethods[],
    param: JsonParameterStore
  ): Promise<any> {
    return this.compileArg(param, pipes)(scope);
  }

  /**
   * Return the resolver of the arguments of a method. It returns the arguments array when every parameter resolves
   * without a promise, and a promise of it otherwise.
   */
  protected compileArgs<Context extends DIContext = DIContext>(entity: JsonMethodStore) {
    const resolvers = JsonParameterStore.getParams(entity.target, entity.propertyKey).map((param) =>
      this.compileArg(param, this.getPipes(param))
    );
    const length = resolvers.length;

    return (scope: PlatformParamsScope<Context>): MaybePromise<any[]> => {
      const args = new Array(length);
      let hasPromise = false;

      for (let index = 0; index < length; index++) {
        const value = resolvers[index](scope);

        hasPromise ||= isPromise(value);
        args[index] = value;
      }

      return hasPromise ? Promise.all(args) : args;
    };
  }

  /**
   * Return the resolver of one parameter: it runs the pipes in order, waits only for a pipe that returns a promise,
   * and wraps any error, thrown or rejected, in a ParamValidationError.
   */
  protected compileArg(param: JsonParameterStore, pipes: PipeMethods[]) {
    const length = pipes.length;
    const onError = (er: unknown) => {
      throw ParamValidationError.from(param, er);
    };

    const run = (value: any, index: number): any => {
      try {
        // explicit isPromise test instead of a closure per pipe: this loop runs for each parameter of each request
        for (; index < length; index++) {
          value = pipes[index].transform(value, param);

          if (isPromise(value)) {
            const next = index + 1;

            return value.then((resolved) => run(resolved, next), onError);
          }
        }

        return value;
      } catch (er) {
        return onError(er);
      }
    };

    return (scope: PlatformParamsScope) => run(scope, 0);
  }
}

injectable(PlatformParams).imports([ParseExpressionPipe]);
