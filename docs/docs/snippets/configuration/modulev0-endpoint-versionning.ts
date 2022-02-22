import {Module} from "@tsed/di";
import {resolve} from "path";

@Module({
  mount: {
    "/rest/v0": [`./controllers/v0/users/*.ts`, `./controllers/v0/groups/*.ts`]
  }
})
export class ModuleV0 {}
