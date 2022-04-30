import {DIContext, Inject, Injectable, InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import {JsonEntityStore, JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamValidationError} from "../errors/ParamValidationError";
import {ParseExpressionPipe} from "../pipes/ParseExpressionPipe";

export type ArgScope<Context extends DIContext = DIContext> = {$ctx: Context} & Record<string, any>;
export type HandlerWithScope<Context extends DIContext = DIContext> = (scope: ArgScope<Context>) => any;

export interface CompileHandlerOptions<Context extends DIContext = DIContext> extends Record<any, unknown> {
  token: TokenProvider;
  propertyKey: string | symbol;
  getCustomArgs?: (scope: ArgScope<Context>) => Promise<any[]>;
}

/**
 * Platform Params abstraction layer.
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  imports: []
})
export class PlatformParams {
  @Inject()
  protected injector: InjectorService;

  async getPipes(param: JsonParameterStore) {
    const get = (pipe: TokenProvider) => {
      return this.injector.getProvider(pipe)!.priority || 0;
    };

    const sort = (p1: TokenProvider, p2: TokenProvider) => (get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0);
    const map = (token: TokenProvider) => this.injector.invoke<PipeMethods>(token)!;
    const promises = await Promise.all([ParseExpressionPipe, ...param.pipes.sort(sort)].map(map));

    return promises.filter(Boolean);
  }

  async compile<Context extends DIContext = DIContext>(entity: JsonEntityStore) {
    const params = JsonParameterStore.getParams(entity.target, entity.propertyKey);

    const argsPipes = await Promise.all(
      params.map(async (param) => {
        return {
          param,
          pipes: await this.getPipes(param)
        };
      })
    );

    return (scope: ArgScope<Context>) => {
      const promises = argsPipes.map(({param, pipes}) => {
        return this.getArg(scope, pipes, param);
      });

      return Promise.all(promises);
    };
  }

  async getArg(scope: ArgScope, pipes: PipeMethods[], param: JsonParameterStore) {
    return pipes.reduce(async (value, pipe) => {
      value = await value;

      try {
        return await pipe.transform(value, param);
      } catch (er) {
        throw ParamValidationError.from(param, er);
      }
    }, scope as any);
  }

  async compileHandler<Context extends DIContext = DIContext>(
    metadata: CompileHandlerOptions<Context>
  ): Promise<HandlerWithScope<Context>> {
    const {token, propertyKey, getCustomArgs} = metadata;

    const provider = this.injector.getProvider(token);
    const getArguments = getCustomArgs || (await this.compile<Context>(JsonEntityStore.fromMethod(token, propertyKey!)));

    if (!provider || !provider.scope || provider.scope === ProviderScope.SINGLETON) {
      const instance = await this.injector.invoke<any>(token);

      return async (scope) => {
        const args = await getArguments(scope);

        return instance[propertyKey!].call(instance, ...args, scope.$ctx);
      };
    }

    return async (scope) => {
      const [instance, args] = await Promise.all([this.injector.invoke<any>(token, scope.$ctx.container), getArguments(scope)]);

      return instance[propertyKey].call(instance, ...args, scope.$ctx);
    };
  }
}
