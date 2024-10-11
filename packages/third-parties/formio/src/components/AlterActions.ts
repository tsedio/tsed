import {AnyToPromise, AnyToPromiseStatus} from "@tsed/core";
import {Inject, InjectorService, Provider} from "@tsed/di";
import {FormioActionInfo} from "@tsed/formio-types";
import {PlatformContext, setResponseHeaders} from "@tsed/platform-http";
import {PlatformParams} from "@tsed/platform-params";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {EndpointMetadata} from "@tsed/schema";

import {Alter} from "../decorators/alter.js";
import {AlterHook} from "../domain/AlterHook.js";
import {SetActionItemMessage} from "../domain/FormioAction.js";
import {FormioActions} from "../domain/FormioActionsIndex.js";
import {FormioService} from "../services/FormioService.js";

@Alter("actions")
export class AlterActions implements AlterHook {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected formio: FormioService;

  @Inject()
  protected params: PlatformParams;

  @Inject()
  protected responseFilter: PlatformResponseFilter;

  transform(actions: FormioActions): FormioActions {
    const {Action} = this.formio;

    return this.getActions().reduce((actions, provider) => {
      const instance = this.injector.invoke<any>(provider.token);
      const options = provider.store.get<FormioActionInfo>("formio:action");
      const resolveHandler = this.createHandler(provider, "resolve");

      return {
        ...actions,
        [options.name]: class extends Action {
          static access = options.access;

          static async info(req: any, res: any, next: Function) {
            let opts = {...options};

            if (instance.info) {
              opts = await instance.info(opts, req, res);
            }

            next(null, opts);
          }

          static async settingsForm(req: any, res: any, next: Function) {
            next(null, await instance.settingsForm(req, res));
          }

          resolve(handler: string, method: string, req: any, res: any, next: Function, setActionItemMessage: SetActionItemMessage): void {
            resolveHandler(this, handler, method, req, res, next, setActionItemMessage);
          }
        }
      };
    }, actions);
  }

  protected getActions() {
    return this.injector.getProviders("formio:action");
  }

  protected createHandler(provider: Provider, propertyKey: string | symbol) {
    const compiledHandler = this.params.compileHandler({
      token: provider.token,
      propertyKey
    });

    return async (
      action: any,
      handler: string,
      method: string,
      req: any,
      res: any,
      next: any,
      setActionItemMessage: SetActionItemMessage
    ) => {
      const {$ctx} = req;

      if ($ctx) {
        $ctx.set("ACTION_CTX", {handler, method, setActionItemMessage, action});
        $ctx.endpoint = EndpointMetadata.get(provider.useClass, "resolve");

        try {
          if (await this.onRequest(compiledHandler, $ctx)) {
            next();
          }
        } catch (er) {
          next(er);
        }
      }
    };
  }

  private async onRequest(handler: any, $ctx: PlatformContext) {
    const resolver = new AnyToPromise();
    const {state, data, status, headers} = await resolver.call(() => handler({$ctx}));

    if (state === AnyToPromiseStatus.RESOLVED) {
      if (status) {
        $ctx.response.status(status);
      }

      if (headers) {
        $ctx.response.setHeaders(headers);
      }

      if (data !== undefined) {
        $ctx.data = data;

        return this.flush($ctx.data, $ctx);
      }

      return true;
    }
  }

  private async flush(data: any, $ctx: PlatformContext) {
    const {response} = $ctx;

    if (!$ctx.isDone()) {
      setResponseHeaders($ctx);

      data = await this.responseFilter.serialize(data, $ctx as any);
      data = await this.responseFilter.transform(data, $ctx as any);

      response.body(data);
    }

    return response;
  }
}
