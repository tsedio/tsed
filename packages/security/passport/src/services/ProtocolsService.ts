import {PlatformContext, PlatformHandler} from "@tsed/common";
import {ancestorsOf} from "@tsed/core";
import {Injectable, InjectorService, Provider} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import Passport, {Strategy} from "passport";
import {PassportException} from "../errors/PassportException";
import {ProtocolMethods, ProtocolOptions} from "../interfaces";
import {PROVIDER_TYPE_PROTOCOL} from "../contants";
import {promisify} from "util";

/**
 * @ignore
 */
@Injectable()
export class ProtocolsService {
  readonly strategies: Map<string, Strategy> = new Map();

  constructor(private injector: InjectorService) {}

  public getProtocols(): Provider[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_PROTOCOL));
  }

  public getProtocolsNames(): string[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Invoke provider and bind it to passport.
   * @param provider
   */
  async invoke(provider: Provider) {
    let {name, useStrategy: strategy, settings} = this.getOptions(provider);
    const protocol = this.injector.get<ProtocolMethods & Record<string, any>>(provider.provide)!;

    if (protocol.$beforeInstall) {
      settings = (await protocol.$beforeInstall(settings)) || settings;
    }

    const instance = new strategy(settings, this.createHandler(provider));

    this.strategies.set(name, instance);

    Passport.use(name, instance);

    if (protocol.$onInstall) {
      await protocol.$onInstall(instance);
    }

    protocol.$strategy = instance;

    return protocol;
  }

  /**
   * Call authenticate passport method.
   * @param protocols
   * @param options
   * @param ctx
   */
  public async authenticate(protocols: string | string[], options: Record<string, any>, ctx: PlatformContext) {
    return this.call("authenticate", protocols, options, ctx);
  }

  /**
   * Call authorize passport method.
   * @param protocols
   * @param options
   * @param ctx
   */
  public async authorize(protocols: string | string[], options: Record<string, any>, ctx: PlatformContext) {
    return this.call("authorize", protocols, options, ctx);
  }

  /**
   * Call passport authenticate or authorize depending on the chosen method.
   * @param method
   * @param protocols
   * @param options
   * @param ctx
   * @private
   */
  private async call(
    method: "authenticate" | "authorize",
    protocols: string | string[],
    options: Record<string, any>,
    ctx: PlatformContext
  ) {
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    protocols = ([] as string[]).concat(protocols);

    if (protocols.length === 0) {
      throw new Unauthorized("Not authorized");
    }

    try {
      options.failWithError = true;
      // @ts-ignore
      const fn = promisify(Passport[method](protocols.length === 1 ? protocols[0] : protocols, options));

      await fn(request, response);
    } catch (er) {
      if (!ancestorsOf(er).includes(Error)) {
        throw new PassportException(er);
      }

      throw er;
    }
  }

  /**
   * Create strategy options based on decorator metadata and global configuration
   * @param provider
   * @private
   */
  private getOptions(provider: Provider<any>): ProtocolOptions {
    const {name} = provider.store.get("protocol");
    const {useStrategy = Strategy, settings = {}}: ProtocolOptions = this.injector.settings.get(`passport.protocols.${name}`) || {};

    return {
      name,
      useStrategy,
      settings: {
        ...settings,
        passReqToCallback: true
      }
    };
  }

  /**
   * Create the verifier handler for passport
   * @param provider
   * @private
   */
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
