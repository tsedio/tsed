import {Module} from "@tsed/di";
import {resolve} from "path";

const rootDir = resolve(__dirname);

@Module({
  mount: {
    "/rest/v1": [`${rootDir}/controllers/v1/**/*.ts`]
  }
})
export class ModuleV1 {}
