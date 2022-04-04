import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("templayed")
export class TemplayedEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine(template);
  }
}
