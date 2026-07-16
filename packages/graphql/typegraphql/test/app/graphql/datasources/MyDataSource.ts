import {ApolloContext} from "@tsed/apollo";
import {DataSource} from "../../../../src/index.js";
import {InjectContext} from "@tsed/di";
import {RESTDataSource} from "@apollo/datasource-rest";

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
