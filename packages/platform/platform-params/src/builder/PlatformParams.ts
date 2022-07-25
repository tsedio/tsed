import {DIContext, Inject, Injectable, InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import {JsonMethodStore, JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamValidationError} from "../errors/ParamValidationError";
import {ParseExpressionPipe} from "../pipes/ParseExpressionPipe";

export type PlatformParamsScope<Context extends DIContext = DIContext> = {$ctx: Context} & Record<string, any>;
export type PlatformParamsCallback<Context extends DIContext = DIContext> = (scope: PlatformParamsScope) => Promise<any>;

/**
 * Platform Params abstraction layer.
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  imports: [ParseExpressionPipe]
})
export class PlatformParams {
  @Inject()
  protected injector: InjectorService;

  getPipes(param: JsonParameterStore) {
    const get = (pipe: TokenProvider) => {
      return this.injector.getProvider(pipe)!.priority || 0;
    };

    const sort = (p1: TokenProvider, p2: TokenProvider) => (get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0);
    const map = (token: TokenProvider) => this.injector.get<PipeMethods>(token)!;

    return [ParseExpressionPipe, ...param.pipes.sort(sort)].map(map).filter(Boolean);
  }

  /**
   * Return a handler with injectable parameters
   * @param handlerMetadata
   */
  compileHandler<Context extends DIContext = DIContext>({
    propertyKey,
    token
  }: {
    propertyKey: string | symbol;
    token: any;
  }): PlatformParamsCallback<Context> {
    const store = JsonMethodStore.fromMethod(token, propertyKey);
    const getArguments = this.compile<Context>(store);

    return async (scope: PlatformParamsScope) => {
      const [instance, args] = await Promise.all([this.injector.invoke<any>(token, scope.$ctx.container), getArguments(scope)]);

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

    return (scope) => {
      const promises = argsPipes.map(({param, pipes}) => this.getArg(scope, pipes, param));
      return Promise.all(promises);
    };
  }

  async getArg<Context extends DIContext = DIContext>(scope: PlatformParamsScope, pipes: PipeMethods[], param: JsonParameterStore) {
    return pipes.reduce(async (value: any | Promise<any>, pipe) => {
      value = await value;

      try {
        return await pipe.transform(value, param);
      } catch (er) {
        throw ParamValidationError.from(param, er);
      }
    }, scope);
  }
}
