import {isFunction, nameOf} from "@tsed/core";
import {Provider} from "./Provider";

export class ValueProvider<T = any> extends Provider {
  public useValue: any;

  toString() {
    return ["Token", this.name, "Value"].join(":");
  }

  getDeps() {
    return [];
  }

  construct() {
    return isFunction(this.useValue) ? this.useValue() : this.useValue;
  }
}
