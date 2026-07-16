import {Adapter, InjectAdapter} from "@tsed/adapters";
import {Injectable} from "@tsed/di";
import {User} from "../graphql/auth/User.js";
import {deserialize} from "@tsed/json-mapper";

@Injectable()
export class UsersRepository {
  @InjectAdapter("users", User)
  adapter: Adapter<User>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    if (!accounts.length) {
      await this.adapter.create(
        deserialize(
          {
            email: "test@test.com",
            password: "test@test.com",
            emailVerified: true
          },
          {type: User, useAlias: false}
        )
      );
    }
  }

  authenticate(email: string, password: string) {
    return this.adapter.findOne({email, password});
  }
}
