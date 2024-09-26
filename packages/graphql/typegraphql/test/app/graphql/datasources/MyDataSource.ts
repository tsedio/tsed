import {RESTDataSource} from "@apollo/datasource-rest";
import type {ApolloContext} from "@tsed/apollo";
import {InjectContext} from "@tsed/common";

import {DataSource} from "../../../../src/index.js";

@DataSource()
export class MyDataSource extends RESTDataSource {
  @InjectContext()
  context: ApolloContext & {token: string};

  constructor() {
    super();
    this.baseURL = "http://localhost:8001";
  }

  willSendRequest(request: any) {
    request.headers.set("Authorization", this.context.token);
  }

  getMyData(id: string) {
    return this.get(`/rest/calendars/${id}`);
  }
}
