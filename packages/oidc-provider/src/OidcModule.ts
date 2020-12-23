import {Inject, InjectorService, PlatformApplication} from "@tsed/common";
import {Module} from "@tsed/di";
import {OidcAdapters} from "./services/OidcAdapters";
import {OidcJwks} from "./services/OidcJwks";
import {OidcProvider} from "./services/OidcProvider";

@Module({
  imports: [OidcProvider, OidcAdapters, OidcJwks]
})
export class OidcModule {
  @Inject()
  app: PlatformApplication;

  @Inject()
  oidcProvider: OidcProvider;

  @Inject()
  injector: InjectorService;

  async $onInit() {
    if (this.oidcProvider.hasConfiguration()) {
      await this.oidcProvider.create();
    }
  }

  async $afterRoutesInit() {
    if (this.oidcProvider.hasConfiguration()) {
      const provider = this.oidcProvider.get();

      this.app.use(provider.callback);
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
}
