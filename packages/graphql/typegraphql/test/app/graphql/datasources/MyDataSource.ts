import {InjectContext} from "@tsed/common";
import {DataSource} from "@tsed/typegraphql";
import {ApolloContext} from "@tsed/apollo";
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
