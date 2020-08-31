import {AfterListen, Configuration, Constant, InjectorService, Module, OnInit} from "@tsed/common";
import {GraphQLSettings} from "./interfaces/GraphQLSettings";
import {GraphQLService} from "./services/GraphQLService";

@Module()
export class GraphQLModule implements OnInit, AfterListen {
  @Constant("graphql", {})
  private settings: {[key: string]: GraphQLSettings};

  constructor(
    private injector: InjectorService,
    private graphQLService: GraphQLService,
    @Configuration() private configuration: Configuration
  ) {}

  $onInit(): Promise<any> | void {
    const promises = Object.keys(this.settings).map(async (key) => this.graphQLService.createServer(key, this.settings[key]));

    return Promise.all(promises);
  }

  $afterListen(): Promise<any> | void {
    const host = this.configuration.getHttpPort();
    Object.keys(this.settings).map(async (key) => {
      const {path} = this.settings[key];
      this.injector.logger.info(`[${key}] GraphQL server is available on http://${host.address}:${host.port}/${path.replace(/^\//, "")}`);
    });
  }
}
