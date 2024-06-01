import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("templayed")
export class TemplayedEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine(template);
  }
}
