import {DataSourceService} from "@tsed/graphql";
import {RESTDataSource} from "apollo-datasource-rest";

@DataSourceService()
export class MyDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://awesome-api.example.com";
  }

  willSendRequest(request: any) {
    request.headers.set("Authorization", this.context.token);
  }

  getMyData(id: string) {
    return this.get(`/v1/my_rest_data/${id}`);
  }
}
