import {ResolverController} from "@tsed/typegraphql";
import {Arg, Authorized, Ctx, Query} from "type-graphql";

import {UserDataSource} from "../datasources/UserDataSource";
import {User} from "../models/User";

@ResolverController(User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  public async user(@Arg("userId") userId: string, @Ctx("dataSources") dataSources: any): Promise<User> {
    const userDataSource: UserDataSource = dataSources.userDataSource;

    return userDataSource.getUserById(userId);
  }
}
