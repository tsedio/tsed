import {Module} from "../../../decorators/module.js";
import {M2Ctrl} from "./controllers/M2Ctrl.js";

@Module({
  mount: {
    "/mod2": [M2Ctrl]
  },
  imports: []
})
export class Module2 {}
