import {PlatformHandler} from "@tsed/common";
import {Injectable, InjectorService, Provider} from "@tsed/di";
import Passport, {Strategy} from "passport";
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
    const platformHandler = this.injector.get<PlatformHandler>(PlatformHandler)!;
    const middleware = platformHandler.createCustomHandler(provider, "$onVerify");

    return async (req: any, ...args: any[]) => {
      const done = args[args.length - 1];
      req.$ctx.set("PROTOCOL_ARGS", args.slice(0, -1));

      try {
        await middleware(req.$ctx);
        done(null, ...[].concat(req.$ctx.data));
      } catch (err) {
        done(err, false, {message: err.message});
      }
    };
  }
}
