import {M1Ctrl1} from "./controllers/M1Ctrl1.js";
import {Module} from "../../../../index.js";
import {SubModule} from "./submodule/SubModule.js";

@Module({
  mount: {
    "/m1": [M1Ctrl1]
  },
  imports: [SubModule]
})
export class Module1 {}
