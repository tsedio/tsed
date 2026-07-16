import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("templayed")
export class TemplayedEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine(template);
  }
}
