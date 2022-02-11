import {Configuration} from "@tsed/di";
import {MyModule} from "./module/MyModule";

@Configuration({
  imports: [MyModule]
})
export class Server {}
