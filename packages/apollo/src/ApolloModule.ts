import {AfterListen, HttpServer, HttpsServer, Logger, OnRoutesInit, PlatformApplication} from "@tsed/common";
import {Configuration, Constant, Inject, Module} from "@tsed/di";
import {ApolloServer, ApolloSettings} from "./interfaces/ApolloSettings";
import {ApolloService} from "./services/ApolloService";

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
      const promises = Object.entries(settings).map(async ([key, options]) => {
        return this.service.createServer(key, options);
      });

      return Promise.all(promises);
    }
  }

  $afterListen(): Promise<any> | void {
    const {settings} = this;

    if (settings) {
      const host = this.configuration.getHttpPort();

      Object.entries(settings).map(async ([key, options]) => {
        const {path} = options;
        this.logger.info(`[${key}] Apollo server is available on http://${host.address}:${host.port}/${path.replace(/^\//, "")}`);
      });
    }
  }
}
