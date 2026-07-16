import {Adapter, InjectAdapter} from "@tsed/adapters";
import {Account} from "../models/Account.js";
import {Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";

@Injectable()
export class UsersRepository {
  @InjectAdapter("accounts", Account)
  protected adapter: Adapter<Account>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    if (!accounts.length) {
      const user = deserialize(
        {
          email: "admin@tsed.dev",
          password: "admin@tsed.dev"
        },
        {type: Account}
      );
      await this.adapter.create(user);
    }
  }

  findByEmail(email: string) {
    return this.adapter.findOne({email});
  }
}
