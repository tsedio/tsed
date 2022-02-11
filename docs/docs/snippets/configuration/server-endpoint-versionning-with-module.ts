import {Configuration} from "@tsed/di";
import {resolve} from "path";
import {ModuleV0} from "./v0/ModuleV0";
import {ModuleV1} from "./v1/ModuleV1";

const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  imports: [ModuleV1, ModuleV0]
})
export class Server {}
