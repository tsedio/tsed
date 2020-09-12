import {HandlerMetadata, HandlerType, Platform} from "@tsed/common";
import {Injectable, InjectorService, Provider} from "@tsed/di";
import * as Passport from "passport";
import {Strategy} from "passport";
import {IProtocol, IProtocolOptions} from "../interfaces";
import {PROVIDER_TYPE_PROTOCOL} from "../registries/ProtocolRegistries";

@Injectable()
export class ProtocolsService {
  readonly strategies: Map<string, Strategy> = new Map();

  constructor(private injector: InjectorService) {}

  public getProtocols(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_PROTOCOL));
  }

  public getProtocolsNames(): string[] {
    return Array.from(this.strategies.keys());
  }

  public invoke(provider: Provider<any>): any {
    const {name, useStrategy: strategy, settings} = this.getOptions(provider);
    const protocol = this.injector.get<IProtocol>(provider.provide)!;
    const instance = new strategy(settings, this.createHandler(provider));

    this.strategies.set(name, instance);

    Passport.use(name, instance);

    if (protocol.$onInstall) {
      protocol.$onInstall(instance);
    }

    return protocol;
  }

  private getOptions(provider: Provider<any>): IProtocolOptions {
    const {name} = provider.store.get("protocol");
    const {useStrategy = Strategy, settings = {}}: IProtocolOptions = this.injector.settings.get(`passport.protocols.${name}`) || {};

    return {
      name,
      useStrategy,
      settings: {
        ...settings,
        passReqToCallback: true
      }
    };
  }

  private createHandler(provider: Provider<any>) {
    const handlerMetadata = new HandlerMetadata({
      token: provider.provide,
      target: provider.useClass,
      type: HandlerType.CUSTOM,
      propertyKey: "$onVerify"
    });

    const platform = this.injector.get<Platform>(Platform)!;
    const middleware = platform.createHandler(handlerMetadata);

    return async (req: any, ...args: any[]) => {
      const done = args[args.length - 1];
      req.args = args.slice(0, -1);
      const ctx = req.$ctx;

      try {
        await middleware(ctx);
        done(null, ...[].concat(ctx.data));
      } catch (err) {
        done(err, false, {message: err.message});
      }
    };
  }
}
