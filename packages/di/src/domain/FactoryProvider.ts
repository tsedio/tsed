import {TokenProvider} from "../interfaces/TokenProvider";
import {Provider} from "./Provider";

export class FactoryProvider<T = any> extends Provider {
  public useFactory: any;

  toString() {
    return ["Token", this.name, "Factory"].filter(Boolean).join(":");
  }

  getDeps() {
    return this.deps || [];
  }

  construct(deps: TokenProvider[]) {
    return this.useFactory(...deps);
  }
}
