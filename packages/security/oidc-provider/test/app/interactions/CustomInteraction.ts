import {Inject} from "@tsed/common";
import {Env} from "@tsed/core";
import {Constant} from "@tsed/di";
import {Interaction} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";
import {Accounts} from "../services/Accounts";

@Interaction({
  name: "custom"
})
@Name("Oidc")
export class CustomInteraction {
  @Constant("env")
  env: Env;

  @Inject()
  accounts: Accounts;

  $onCreate() {}
}
