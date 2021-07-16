import {AfterListen, Configuration, Inject, InjectorService, Module, OnRoutesInit} from "@tsed/common";
import {TypeGraphQLSettings} from "./interfaces";
import {TypeGraphQLService} from "./services/TypeGraphQLService";

/**
 * @ignore
 */
@Module()
export class TypeGraphQLModule implements OnRoutesInit, AfterListen {
  @Inject()
  protected service: TypeGraphQLService;

  @Inject()
  protected injector: InjectorService;

  @Configuration()
  protected configuration: Configuration;

  get settings(): {[key: string]: TypeGraphQLSettings} | undefined {
    return this.configuration.get("graphql") || this.configuration.get("typegraphql");
  }

  $onRoutesInit(): Promise<any> | void {
    const {settings} = this;
    if (settings) {
      const promises = Object.entries(settings).map(async ([key, options]) => {
        return this.service.createServer(key, options);
      });

      return Promise.all(promises);
    }
  }

  $afterListen(): Promise<any> | void {
    const {settings} = this;

    if (settings) {
      const httpHost = this.configuration.getHttpPort();
      const httpsHost = this.configuration.getHttpsPort();
      const host = httpsHost.port ? httpsHost : httpHost;

      Object.entries(settings).map(async ([key, options]) => {
        const {path} = options;
        this.injector.logger.info(`[${key}] GraphQL server is available on http://${host.address}:${host.port}/${path.replace(/^\//, "")}`);
      });
    }
  }
}
