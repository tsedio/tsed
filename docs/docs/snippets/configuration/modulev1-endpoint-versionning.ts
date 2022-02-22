import {Module} from "@tsed/di";
import {resolve} from "path";

@Module({
  mount: {
    "/rest/v1": [`./controllers/v1/**/*.ts`]
  }
})
export class ModuleV1 {}
