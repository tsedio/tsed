import {Module} from "@tsed/di";
import {UserController} from "./users/UserController";

@Module({
  mount: {
    "/rest/v0": [UserController]
  }
})
export class ModuleV0 {}
