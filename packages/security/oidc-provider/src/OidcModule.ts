import {constant, inject, injector, Module} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import koaMount from "koa-mount";

import {OidcAdapters} from "./services/OidcAdapters.js";
import {OidcJwks} from "./services/OidcJwks.js";
import {OidcProvider} from "./services/OidcProvider.js";

@Module({
  imports: [OidcProvider, OidcAdapters, OidcJwks]
})
export class OidcModule {
  protected app: PlatformApplication = inject(PlatformApplication);
  protected platformName = constant<string>("PLATFORM_NAME");
  protected basePath = constant("oidc.path", "/oidc");
  protected oidcProvider = inject(OidcProvider);

  async $onInit() {
    if (this.oidcProvider.hasConfiguration()) {
      await this.oidcProvider.create();
    }
  }

  async $onRoutesInit() {
    if (this.basePath !== "/") {
      this.app.use(await this.getRewriteMiddleware());
    }
  }

  $afterRoutesInit() {
    if (this.oidcProvider.hasConfiguration()) {
      const provider = this.oidcProvider.get();

      switch (this.platformName) {
        default:
        case "express":
          this.app.use(this.basePath, provider.callback());
          break;
        case "koa":
          this.app.use(koaMount(this.basePath, provider.app));
          break;
      }
    }
  }

  $onReady() {
    const inj = injector();

    if (this.oidcProvider.hasConfiguration() && "getBestHost" in inj.settings) {
      // @ts-ignore
      const host = inj.settings.getBestHost();
      const url = host.toString();

      inj.logger.info(`WellKnown is available on ${url}/.well-known/openid-configuration`);
    }
  }

  private async getRewriteMiddleware() {
    switch (this.platformName) {
      default:
      case "express":
        const {default: expressUrlRewrite} = await import("express-urlrewrite");
        return expressUrlRewrite("/.well-known/*", `${this.basePath}/.well-known/$1`);
      case "koa":
        // @ts-ignore
        const {default: koaUrlRewrite} = await import("koa-rewrite");
        return koaUrlRewrite("/.well-known/(.*)", `${this.basePath}/.well-known/$1`);
    }
  }
}
