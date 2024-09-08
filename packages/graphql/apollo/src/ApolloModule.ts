import {AfterListen, Logger, OnRoutesInit} from "@tsed/common";
import {Configuration, Inject, Module, InjectorService} from "@tsed/di";
import {ApolloSettings} from "./interfaces/ApolloSettings.js";
import {ApolloService} from "./services/ApolloService.js";

@Module()
export class ApolloModule implements OnRoutesInit, AfterListen {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected service: ApolloService;

  @Configuration()
  protected configuration: Configuration;

  @Inject(InjectorService)
  protected injector: InjectorService;

  get settings(): {[key: string]: ApolloSettings} | undefined {
    return this.configuration.get("apollo", this.configuration.get("graphql", this.configuration.get("typegraphql")));
  }

  async $onRoutesInit(): Promise<void> {
    const {settings, injector} = this;

    if (settings) {
      const promises = Object.entries(settings).map(async ([id, options]) => {
        options = await injector.alterAsync("$alterApolloSettings", {id, ...options});

        return this.service.createServer(id, options);
      });

      await Promise.all(promises);
    }
  }

  $afterListen(): Promise<any> | void {
    const host = this.configuration.getBestHost();

    const displayLog = (key: string, path: string) => {
      const url = typeof host.port === "number" ? `${host.protocol}://${host.address}:${host.port}` : "";

      this.logger.info(`[${key}] Apollo server is available on ${url}/${path.replace(/^\//, "")}`);
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
