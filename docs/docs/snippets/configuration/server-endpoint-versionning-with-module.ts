import {Configuration} from "@tsed/di";
import {ModuleV0} from "./v0/ModuleV0";
import {ModuleV1} from "./v1/ModuleV1";

@Configuration({
  imports: [ModuleV1, ModuleV0]
})
export class Server {}
