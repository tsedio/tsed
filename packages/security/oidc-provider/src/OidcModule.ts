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
    if (this.oidcProvider.hasConfiguration() && this.injector.settings.getBestHost) {
      const {injector} = this;
      const host = injector.settings.getBestHost();
      const url = host.toString();

      injector.logger.info(`WellKnown is available on ${url}/.well-known/openid-configuration`);
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
