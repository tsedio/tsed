import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("bracket", {
  requires: "bracket-template"
})
export class BracketEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine.compile(template, options);
  }
}
