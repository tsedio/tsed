import {Module} from "@tsed/di";
import {UserController} from "./users/UserController";

@Module({
  mount: {
    "/rest/v1": [UserController]
  }
})
export class ModuleV1 {}
