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
    const host = this.configuration.getBestHost();

    const displayLog = (key: string, path: string) => {
      const url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";

      this.injector.logger.info(`[${key}] GraphQL server is available on ${url}${path.replace(/^\//, "")}`);
    };

    const {settings} = this;

    if (settings) {
      Object.entries(settings).map(async ([key, options]) => {
        const {path} = options;

        displayLog(key, path);
      });
    }
  }
}
