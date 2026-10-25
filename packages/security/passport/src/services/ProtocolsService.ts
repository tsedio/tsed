import {constant, inject, injectable, injector, Provider} from "@tsed/di";
import Passport, {Strategy} from "passport";
import {PlatformContext, PlatformHandler} from "@tsed/platform-http";
import {PROVIDER_TYPE_PROTOCOL} from "../contants/constants.js";
import {PassportException} from "../errors/PassportException.js";
import {PassportMessage} from "../errors/PassportMessage.js";
import type {ProtocolMethods} from "../interfaces/ProtocolMethods.js";
import type {ProtocolOptions} from "../interfaces/ProtocolOptions.js";
import {Unauthorized} from "@tsed/exceptions";
import {ancestorsOf} from "@tsed/core";
import {promisify} from "node:util";
import {setSessionProtocol} from "../utils/sessionProtocol.js";

/**
 * Context key holding the name of the protocol whose verify callback accepted the request.
 * @ignore
 */
const VERIFIED_PROTOCOL = "PASSPORT_VERIFIED_PROTOCOL";

/**
 * Context key holding the protocols requested by the running `@Authenticate()` call.
 * @ignore
 */
const LOGIN_PROTOCOLS = "PASSPORT_LOGIN_PROTOCOLS";

/**
 * @ignore
 */
export class ProtocolsService {
  readonly strategies: Map<string, Strategy> = new Map();
  readonly loginOnlyProtocols: Set<string> = new Set();
  protected platformHandler = inject(PlatformHandler);

  public getProtocols(): Provider[] {
    return injector().providers.getMany(PROVIDER_TYPE_PROTOCOL);
  }

  public getProtocolsNames(): string[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Return true when the protocol must only run on login endpoints (`@Authenticate()`).
   * @param name
   */
  public isLoginOnly(name: string): boolean {
    return this.loginOnlyProtocols.has(name);
  }

  /**
   * Invoke provider and bind it to passport.
   * @param provider
   */
  async invoke(provider: Provider) {
    let {name, useStrategy: strategy, settings, loginOnly} = this.getOptions(provider);
    const protocol = inject<ProtocolMethods & Record<string, any>>(provider.token)!;

    if (protocol.$beforeInstall) {
      settings = (await protocol.$beforeInstall(settings)) || settings;
    }

    const instance = new strategy(settings, this.createHandler(provider));

    this.strategies.set(name, instance);
    loginOnly ? this.loginOnlyProtocols.add(name) : this.loginOnlyProtocols.delete(name);

    Passport.use(name, instance);

    if (protocol.$onInstall) {
      await protocol.$onInstall(instance);
    }

    protocol.$strategy = instance;

    return protocol;
  }

  /**
   * Passport.js serializer layer recording the protocol that establishes the login session.
   *
   * It runs inside `req.logIn()`, so the record is kept even when Passport.js ends the request itself
   * (`successRedirect`, `successReturnToOrRedirect`). It then passes to the next serializer.
   */
  public serializeSessionProtocol(req: any, user: any, done: (err: any) => void) {
    const protocols: string[] | undefined = req.$ctx?.get(LOGIN_PROTOCOLS);

    if (protocols) {
      const verified = req.$ctx.get(VERIFIED_PROTOCOL);
      const protocol = protocols.includes(verified) ? verified : protocols.length === 1 ? protocols[0] : undefined;

      protocol && setSessionProtocol(req, protocol);
    }

    done("pass");
  }

  /**
   * Call authenticate passport method.
   * @param protocols
   * @param options
   * @param ctx
   */
  public authenticate(protocols: string | string[], options: Record<string, any>, ctx: PlatformContext) {
    return this.call("authenticate", protocols, options, ctx);
  }

  /**
   * Call authorize passport method.
   * @param protocols
   * @param options
   * @param ctx
   */
  public authorize(protocols: string | string[], options: Record<string, any>, ctx: PlatformContext) {
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

    if (method === "authenticate") {
      ctx.set(LOGIN_PROTOCOLS, protocols);
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
    const {name, loginOnly: defaultLoginOnly = false} = provider.store.get("protocol");
    const {
      useStrategy = Strategy,
      settings = {},
      loginOnly = defaultLoginOnly
    } = constant<ProtocolOptions>(`passport.protocols.${name}`) || ({} as ProtocolOptions);

    return {
      name,
      useStrategy,
      loginOnly,
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
  private createHandler(provider: Provider) {
    const middleware = this.platformHandler.createCustomHandler(provider, "$onVerify");
    const {name} = provider.store.get("protocol");

    return async (req: any, ...args: any[]) => {
      const done = args[args.length - 1];

      if (req.$ctx) {
        req.$ctx.set("PROTOCOL_ARGS", args.slice(0, -1));

        try {
          await middleware(req.$ctx);

          if ([].concat(req.$ctx.data)[0]) {
            req.$ctx.set(VERIFIED_PROTOCOL, name);
          }

          done(null, ...[].concat(req.$ctx.data));
        } catch (err) {
          const error = err as Error;

          if (err instanceof PassportMessage) {
            done(null, false, {...err.opts, message: err.message});
          } else {
            done(error, false, {message: error.message});
          }
        }
      } else {
        done(new Error("Headers already sent"), false, {message: "Headers already sent"});
      }
    };
  }
}

injectable(ProtocolsService);
