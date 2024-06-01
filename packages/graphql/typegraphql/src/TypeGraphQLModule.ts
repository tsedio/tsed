import {Configuration, Inject, InjectorService, Module} from "@tsed/di";
import {TypeGraphQLSettings} from "./interfaces/interfaces.js";
import {TypeGraphQLService} from "./services/TypeGraphQLService.js";

/**
 * @ignore
 */
@Module()
export class TypeGraphQLModule {
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
      const promises = Object.entries(settings).map(([key, options]) => {
        return this.service.createServer(key, options);
      });

      return Promise.all(promises);
    }
  }

  $afterListen(): Promise<any> | void {
    const host = this.configuration.getBestHost();

    const displayLog = (key: string, path: string) => {
      const url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";

      this.injector.logger.info(`[${key}] GraphQL server is available on ${url}/${path.replace(/^\//, "")}`);
    };

    const {settings} = this;

    if (settings) {
      Object.entries(settings).map(([key, options]) => {
        const {path} = options;

        displayLog(key, path);
      });
    }
  }
}
