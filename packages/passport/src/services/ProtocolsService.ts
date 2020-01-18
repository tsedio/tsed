import {HandlerBuilder, HandlerMetadata, HandlerType, InjectorService, Service} from "@tsed/common";
import {Provider} from "@tsed/di";
import * as Passport from "passport";
import {Strategy} from "passport-strategy";
import {IProtocol, IProtocolOptions} from "../interfaces";
import {PROVIDER_TYPE_PROTOCOL} from "../registries/ProtocolRegistries";

@Service()
export class ProtocolsService {
  readonly strategies: Map<string, Strategy> = new Map();

  constructor(private injector: InjectorService) {}

  public getProtocols(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_PROTOCOL));
  }

  public getProviderNames(): string[] {
    return this.getProtocols().map(provider => this.getOptions(provider).name);
  }

  public invoke(provider: Provider<any>): any {
    const {name, useStrategy: strategy, settings} = this.getOptions(provider);
    const handler = this.createHandler(provider);
    const protocol = this.injector.get<IProtocol>(provider.provide)!;
    const instance: Strategy = new strategy(settings, handler);

    this.strategies.set(name, instance);

    Passport.use(name, instance);

    if (protocol.$onInstall) {
      protocol.$onInstall(instance);
    }

    return protocol;
  }

  private getOptions(provider: Provider<any>): IProtocolOptions {
    const {name} = provider.store.get("protocol");
    const protocol: IProtocolOptions = provider.store.get("protocol") || {};
    const serverProtocol: IProtocolOptions = this.injector.settings.get(`passport.protocols.${name}`) || {};

    const {useStrategy = Strategy} = {...protocol, ...serverProtocol};

    return {
      name,
      useStrategy,
      settings: {
        ...(protocol.settings || {}),
        ...(serverProtocol.settings || {}),
        passReqToCallback: true
      }
    };
  }

  private createHandler(provider: Provider<any>) {
    const handlerMetadata = new HandlerMetadata({
      token: provider.provide,
      target: provider.useClass,
      type: HandlerType.CONTROLLER,
      propertyKey: "$onVerify"
    });

    const builder = new HandlerBuilder(handlerMetadata);
    const middleware = builder.build(this.injector);

    return (req: any, ...args: any[]) => {
      const done = args[args.length - 1];

      return middleware(req, req.res, (err: any) => {
        if (err) {
          done(err);
        } else {
          done(null, req.ctx.data);
        }
      });
    };
  }
}
