import {AfterListen, Constant, Injectable, OnInit, ServerSettingsService} from "@tsed/common";
import {$log} from "ts-log-debug";
import {IGraphQLSettings} from "./interfaces/IGraphQLSettings";
import {GraphQLService} from "./services/GraphQLService";

@Injectable()
export class GraphQLModule implements OnInit, AfterListen {
  @Constant("graphql", {})
  private settings: {[key: string]: IGraphQLSettings};

  constructor(private graphQLService: GraphQLService, private serverSettingsService: ServerSettingsService) {}

  $onInit(): Promise<any> | void {
    const promises = Object.keys(this.settings).map(async key => this.graphQLService.createServer(key, this.settings[key]));

    return Promise.all(promises);
  }

  $afterListen(): Promise<any> | void {
    const host = this.serverSettingsService.getHttpPort();

    Object.keys(this.settings).map(async key => {
      const {path} = this.settings[key];
      $log.info(`[${key}] GraphQL server is available on http://${host.address}:${host.port}/${path.replace(/^\//, "")}`);
    });
  }
}
