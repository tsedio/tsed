import {Adapter, InjectAdapter} from "@tsed/adapters";
import {Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";

import {AccessToken, AuthorizationCode, DeviceCode, OidcAccountsMethods} from "../../../src/index.js";
import {Account} from "../models/Account.js";

@Injectable()
export class Accounts implements OidcAccountsMethods {
  @InjectAdapter("accounts", Account)
  adapter: Adapter<Account>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    if (!accounts.length) {
      await this.adapter.create(
        deserialize(
          {
            email: "test@test.com",
            emailVerified: true
          },
          {useAlias: false}
        )
      );
    }
  }

  findAccount(id: string, token: AuthorizationCode | AccessToken | DeviceCode | undefined) {
    return this.adapter.findById(id);
  }

  authenticate(email: string, password: string) {
    return this.adapter.findOne({email});
  }
}
