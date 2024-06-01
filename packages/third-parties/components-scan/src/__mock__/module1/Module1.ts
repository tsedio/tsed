import {SubModule} from "./submodule/SubModule.js";
import {Module} from "@tsed/di";
import {M1Ctrl1} from "./controllers/M1Ctrl1.js";

@Module({
  mount: {
    "/m1": [M1Ctrl1]
  },
  imports: [SubModule]
})
export class Module1 {}
