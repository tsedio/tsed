import {Env, setValue} from "@tsed/core";
import {Constant, Inject, Injectable, InjectorService} from "@tsed/di";
import {Provider as OIDCProvider, Configuration, interactionPolicy} from "oidc-provider";
import {INTERACTIONS} from "../constants";
import {OidcAccountsMethods, OidcSettings} from "../domain";
import {OidcAdapters} from "./OidcAdapters";
import {OidcInteractions} from "./OidcInteractions";
import {OidcJwks} from "./OidcJwks";
import {PlatformApplication} from "@tsed/common";

@Injectable()
export class OidcProvider {
  raw: OIDCProvider;

  @Constant("env")
  protected env: Env;

  @Constant("httpPort")
  protected httpPort: number | string;

  @Constant("httpsPort")
  protected httpsPort: number | string;

  @Constant("oidc.issuer", "")
  protected issuer: string;

  @Constant("oidc")
  protected oidc: OidcSettings;

  @Constant("PLATFORM_NAME")
  protected platformName: string;

  @Inject()
  protected oidcJwks: OidcJwks;

  @Inject()
  protected oidcInteractions: OidcInteractions;

  @Inject()
  protected adapters: OidcAdapters;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected app: PlatformApplication;

  hasConfiguration() {
    return !!this.oidc;
  }

  async getConfiguration(): Promise<Configuration> {
    const [jwks, adapter] = await Promise.all([this.oidcJwks.getJwks(), this.adapters.createAdapterClass()]);
    const {issuer, jwksPath, secureKey, proxy, Accounts, ...options} = this.oidc;

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
      configuration.findAccount = (ctx, id, token) =>
        this.injector.get<OidcAccountsMethods>(Accounts)!.findAccount(id, token, (ctx.req as any).$ctx);
    }

    if (this.env === Env.PROD) {
      setValue(configuration, "cookies.short.secure", true);
      setValue(configuration, "cookies.long.secure", true);
    }

    const policy = this.getPolicy();
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

  get(): OIDCProvider {
    return this.raw;
  }

  /**
   * Create a new instance of OidcProvider
   */
  async create(): Promise<void | OIDCProvider> {
    const {proxy, secureKey} = this.oidc;
    const configuration = await this.getConfiguration();
    const oidcProvider = new OIDCProvider(this.getIssuer(), configuration);

    if (proxy || this.env === Env.PROD) {
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

    if (this.env !== Env.PROD) {
      this.allowHttpLocalhost();
    }

    await this.injector.emit("$onCreateOIDC", this.raw);

    return this.raw;
  }

  private getInteractionsUrl() {
    const provider = this.injector.getProviders().find((provider) => provider.subType === INTERACTIONS);

    if (provider) {
      return (ctx: any, interaction: any) => {
        // eslint-disable-line no-unused-vars
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

  private getPolicy() {
    const policy = interactionPolicy.base();
    const interactions = this.oidcInteractions.getInteractions();

    if (interactions.length) {
      interactions.forEach((provider) => {
        const {name, ...options} = provider.store.get("interactionOptions");

        if (!policy.get(name)) {
          policy.add(
            new interactionPolicy.Prompt({
              name,
              ...options
            })
          );
        }

        const instance = this.injector.get(provider.token);

        if (instance.$onCreate) {
          instance.$onCreate(policy.get(name));
        }
      });
    }

    return this.injector.alter("$alterOidcPolicy", policy);
  }
}
