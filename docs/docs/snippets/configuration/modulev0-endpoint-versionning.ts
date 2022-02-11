import {Module} from "@tsed/di";
import {resolve} from "path";

const rootDir = resolve(__dirname);

@Module({
  mount: {
    "/rest/v0": [`${rootDir}/controllers/v0/users/*.ts`, `${rootDir}/controllers/v0/groups/*.ts`]
  }
})
export class ModuleV0 {}
