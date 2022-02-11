import {Configuration} from "@tsed/di";
import {resolve} from "path";

const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  mount: {
    "/rest/v1": [`${rootDir}/controllers/v1/**/*.ts`],
    "/rest/v0": [`${rootDir}/controllers/v0/users/*.ts`, `${rootDir}/controllers/v0/groups/*.ts`]
  }
})
export class Server {}
