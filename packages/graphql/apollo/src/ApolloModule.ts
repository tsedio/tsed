import {AfterListen, Logger, OnRoutesInit} from "@tsed/common";
import {Configuration, Inject, Module} from "@tsed/di";
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

  get settings(): {[key: string]: ApolloSettings} | undefined {
    return this.configuration.get("apollo");
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

      this.logger.info(`[${key}] Apollo server is available on ${url}${path.replace(/^\//, "")}`);
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
