import {Module} from "../../../decorators/module";
import {M2Ctrl} from "./controllers/M2Ctrl";

@Module({
  mount: {
    "/mod2": [M2Ctrl]
  },
  imports: []
})
export class Module2 {}
