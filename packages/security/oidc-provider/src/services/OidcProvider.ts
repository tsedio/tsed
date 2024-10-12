import {Env, setValue} from "@tsed/core";
import {constant, context, inject, Injectable, InjectorService} from "@tsed/di";
import {PlatformApplication, PlatformContext} from "@tsed/platform-http";
import Provider, {type Configuration, type KoaContextWithOIDC} from "oidc-provider";

import {INTERACTIONS} from "../constants/constants.js";
import {OidcAccountsMethods} from "../domain/OidcAccountsMethods.js";
import {OidcSettings} from "../domain/OidcSettings.js";
import {OIDC_ERROR_EVENTS} from "../utils/events.js";
import {OidcAdapters} from "./OidcAdapters.js";
import {OidcJwks} from "./OidcJwks.js";
import {OidcPolicy} from "./OidcPolicy.js";

function mapError(error: any) {
  return Object.getOwnPropertyNames(error).reduce((obj: any, key) => {
    return {
      ...obj,
      [key]: error[key]
    };
  }, {});
}

@Injectable()
export class OidcProvider {
  raw: Provider;

  protected env = constant<Env>("env");
  protected httpPort = constant<number | string>("httpPort");
  protected httpsPort = constant<number | string>("httpsPort");
  protected issuer = constant<string>("oidc.issuer", "");
  protected oidc = constant<OidcSettings>("oidc")!;
  protected platformName = constant<string>("PLATFORM_NAME");
  protected oidcJwks = inject(OidcJwks);
  protected oidcPolicy = inject(OidcPolicy);
  protected adapters = inject(OidcAdapters);
  protected injector = inject(InjectorService);
  protected app = inject(PlatformApplication);

  get logger() {
    return this.$ctx.logger;
  }

  protected get $ctx() {
    return context<PlatformContext>();
  }

  hasConfiguration() {
    return !!this.oidc;
  }

  async getConfiguration(): Promise<Configuration> {
    const [jwks, adapter] = await Promise.all([this.oidcJwks.getJwks(), this.adapters.createAdapterClass()]);
    const {
      issuer,
      jwksPath,
      secureKey,
      proxy,
      Accounts,
      secureCookies = this.env == Env.PROD,
      Adapter,
      connectionName,
      render,
      ...options
    } = this.oidc;

    const configuration: Configuration = {
      interactions: {
        /* istanbul ignore next */
        url: (ctx, interaction) => `interaction/${interaction.uid}`
      },
      ...options,
      adapter,
      jwks
    };

    if (Accounts) {
      configuration.findAccount = (ctx, id, token) => this.injector.get<OidcAccountsMethods>(Accounts)!.findAccount(id, token);
    }

    if (secureCookies) {
      setValue(configuration, "cookies.short.secure", true);
      setValue(configuration, "cookies.long.secure", true);
    }

    const policy = this.oidcPolicy.getPolicy();

    if (policy) {
      setValue(configuration, "interactions.policy", policy);
    }

    const url = this.getInteractionsUrl();
    if (url) {
      setValue(configuration, "interactions.url", url);
    }

    return configuration;
  }

  getIssuer() {
    if (this.issuer) {
      return this.issuer;
    }

    // istanbul ignore next
    if (this.httpsPort) {
      return `https://localhost:${this.httpsPort}`;
    }

    return `http://localhost:${this.httpPort}`;
  }

  get(): Provider {
    return this.raw;
  }

  /**
   * Create a new instance of OidcProvider
   */
  async create(): Promise<void | Provider> {
    const {proxy = this.env === Env.PROD, secureKey, allowHttpLocalhost = this.env !== Env.PROD} = this.oidc;
    const configuration = await this.getConfiguration();

    await this.injector.alterAsync("$alterOidcConfiguration", configuration);

    const oidcProvider = new Provider(this.getIssuer(), configuration);

    if (proxy) {
      // istanbul ignore next
      switch (this.platformName) {
        default:
        case "express":
          oidcProvider.proxy = true;
          break;
        case "koa":
          (this.app.rawApp as any).proxy = true;
          break;
      }
    }

    if (secureKey) {
      oidcProvider.app.keys = secureKey;
    }

    this.raw = oidcProvider;

    if (allowHttpLocalhost) {
      this.allowHttpLocalhost();
    }

    OIDC_ERROR_EVENTS.map((event) => {
      this.raw.on(event, this.createErrorHandler(event));
    });

    await this.injector.emit("$onCreateOIDC", this.raw);

    return this.raw;
  }

  private createErrorHandler(event: string) {
    return (ctx: KoaContextWithOIDC, error: any, accountId?: string, sid?: string) => {
      this.logger.error({
        event: "OIDC_ERROR",
        type: event,
        error: mapError(error),
        account_id: accountId,
        params: ctx.oidc.params,
        headers: ctx.headers,
        sid
      });

      // TODO see if we need to call platformExceptions
      // this.platformExceptions.catch(error, ctx.request.$ctx);
    };
  }

  private getInteractionsUrl() {
    const provider = this.injector.getProviders().find((provider) => provider.subType === INTERACTIONS);

    if (provider) {
      return (ctx: any, interaction: any) => {
        return provider.path.replace(/:uid/, interaction.uid);
      };
    }
  }

  private allowHttpLocalhost() {
    const {invalidate: orig} = (this.raw.Client as any).Schema.prototype;

    (this.raw.Client as any).Schema.prototype.invalidate = function invalidate(message: string, code: string) {
      if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
        return;
      }

      /* istanbul ignore next */
      return orig.call(this, message);
    };
  }
}
