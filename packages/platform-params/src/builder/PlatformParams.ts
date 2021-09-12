import {BaseContext, Inject, Injectable, InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import {ParamMetadata, PipeMethods} from "../domain/ParamMetadata";
import {ParamValidationError} from "../errors/ParamValidationError";
import {ParseExpressionPipe} from "../pipes/ParseExpressionPipe";

export type ArgScope = {$ctx: BaseContext} & Record<string, any>;

/**
 * Platform Params abstraction layer.
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformParams {
  @Inject()
  protected injector: InjectorService;

  #caches: WeakMap<any, PipeMethods[]> = new WeakMap<any, PipeMethods[]>();

  async build(param: ParamMetadata) {
    const get = (pipe: TokenProvider) => {
      return this.injector.getProvider(pipe)!.priority || 0;
    };

    const sort = (p1: TokenProvider, p2: TokenProvider) => (get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0);
    const map = (token: TokenProvider) => this.injector.invoke<PipeMethods>(token)!;
    const promises = await Promise.all([ParseExpressionPipe, ...param.pipes.sort(sort)].map(map));
    const pipes = promises.filter(Boolean);

    this.#caches.set(param, pipes);

    return pipes;
  }

  getPipes(param: ParamMetadata) {
    return this.#caches.get(param) || [];
  }

  async runPipes(scope: ArgScope, param: ParamMetadata) {
    return this.getPipes(param).reduce(async (value, pipe) => {
      value = await value;

      try {
        return await pipe.transform(value, param);
      } catch (er) {
        throw ParamValidationError.from(param, er);
      }
    }, scope as any);
  }

  /**
   * Return arguments to call handler
   */
  async getArgs(scope: ArgScope, parameters: ParamMetadata[]) {
    return Promise.all(parameters.map((param) => this.runPipes(scope, param)));
  }
}
