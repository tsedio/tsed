import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("bracket", {
  requires: "bracket-template"
})
export class BracketEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine.compile(template, options);
  }
}
