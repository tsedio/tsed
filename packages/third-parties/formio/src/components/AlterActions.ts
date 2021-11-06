import {EndpointMetadata, PlatformContext, PlatformHandler} from "@tsed/common";
import {Inject, InjectorService, Provider} from "@tsed/di";
import {FormioActionInfo} from "@tsed/formio-types";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";
import {SetActionItemMessage} from "../domain/FormioAction";
import {FormioActions} from "../domain/FormioActionsIndex";
import {FormioService} from "../services/FormioService";

@Alter("actions")
export class AlterActions implements AlterHook {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected formio: FormioService;

  transform(actions: FormioActions): FormioActions {
    const {Action} = this.formio;

    return this.getActions().reduce((actions, provider) => {
      const instance = this.injector.invoke<any>(provider.token);
      const options = provider.store.get<FormioActionInfo>("formio:action");
      const resolveHandler = this.createResolveHandler(provider);

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

  protected createResolveHandler(provider: Provider<any>) {
    const platformHandler = this.injector.get<PlatformHandler>(PlatformHandler)!;
    const middleware = platformHandler.createCustomHandler(provider, "resolve");

    return (
      action: any,
      handler: string,
      method: string,
      req: {$ctx: PlatformContext},
      res: Response,
      next: any,
      setActionItemMessage: SetActionItemMessage
    ) => {
      req.$ctx.set("ACTION_CTX", {handler, method, setActionItemMessage, action});
      req.$ctx.endpoint = EndpointMetadata.get(provider.useClass, "resolve");

      middleware(req.$ctx)
        .then(() => (req.$ctx.data ? platformHandler.flush(req.$ctx.data, req.$ctx) : next()))
        .catch(next);
    };
  }
}
