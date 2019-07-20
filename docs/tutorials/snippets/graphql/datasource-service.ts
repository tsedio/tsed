import {DataSourceService} from "@tsed/graphql";
import {RESTDataSource} from "apollo-datasource-rest";
import {User} from "../models/User";

@DataSourceService()
export class UserDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://myapi.com/api/users";
  }

  getUserById(id: string): Promise<User> {
    return this.get(`/${id}`);
  }
}
