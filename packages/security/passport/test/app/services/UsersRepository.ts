import {Adapter, InjectAdapter} from "@tsed/adapters";
import {Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {Account} from "../models/Account";

@Injectable()
export class UsersRepository {
  @InjectAdapter("accounts", Account)
  protected adapter: Adapter<Account>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    if (!accounts.length) {
      const user = deserialize(
        {
          email: "admin@tsed.io",
          password: "admin@tsed.io"
        },
        {type: Account}
      );
      await this.adapter.create(user);
    }
  }

  async findByEmail(email: string) {
    return this.adapter.findOne({email});
  }
}
