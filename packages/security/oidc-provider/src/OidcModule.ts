import {Inject, InjectorService, PlatformApplication} from "@tsed/common";
import {Constant, Module} from "@tsed/di";
import {OidcAdapters} from "./services/OidcAdapters";
import {OidcJwks} from "./services/OidcJwks";
import {OidcProvider} from "./services/OidcProvider";

@Module({
  imports: [OidcProvider, OidcAdapters, OidcJwks]
})
export class OidcModule {
  @Inject()
  app: PlatformApplication;

  @Constant("PLATFORM_NAME")
  platformName: string;

  @Constant("oidc.path", "/")
  basePath: string;

  @Inject()
  oidcProvider: OidcProvider;

  @Inject()
  injector: InjectorService;

  async $onInit() {
    if (this.oidcProvider.hasConfiguration()) {
      await this.oidcProvider.create();
    }
  }

  async $onRoutesInit() {
    if (this.basePath !== "/") {
      this.app.use(this.getRewriteMiddleware());
    }
  }

  async $afterRoutesInit() {
    if (this.oidcProvider.hasConfiguration()) {
      const provider = this.oidcProvider.get();

      switch (this.platformName) {
        default:
        case "express":
          this.app.use(this.basePath, provider.callback());
          break;
        case "koa":
          this.app.use(require("koa-mount")(this.basePath, provider.app));
          break;
      }
    }
  }

  $onReady() {
    if (this.oidcProvider.hasConfiguration()) {
      const {injector} = this;
      const {httpsPort, httpPort} = injector.settings;

      const displayLog = (host: any) => {
        const url = [`${host.protocol}://${host.address}`, typeof host.port === "number" && host.port].filter(Boolean).join(":");

        injector.logger.info(`WellKnown is available on ${url}/.well-known/openid-configuration`);
      };

      /* istanbul ignore next */
      if (httpsPort) {
        const host = injector.settings.getHttpsPort();
        displayLog({protocol: "https", ...host});
      } else if (httpPort) {
        const host = injector.settings.getHttpPort();
        displayLog({protocol: "http", ...host});
      }
    }
  }

  private getRewriteMiddleware() {
    switch (this.platformName) {
      default:
      case "express":
        return require("express-urlrewrite")("/.well-known/*", `${this.basePath}/.well-known/$1`);
      case "koa":
        return require("koa-rewrite")("/.well-known/(.*)", `${this.basePath}/.well-known/$1`);
    }
  }
}
