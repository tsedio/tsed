import {TokenProvider} from "../interfaces/TokenProvider";
import {FactoryProvider} from "./FactoryProvider";
import {ProviderScope} from "./ProviderScope";

export class AsyncFactoryProvider<T = any> extends FactoryProvider {
  public useAsyncFactory: any;

  get scope(): ProviderScope {
    return ProviderScope.SINGLETON;
  }

  toString() {
    return ["Token", this.name, "AsyncFactory"].filter(Boolean).join(":");
  }

  isAsync(): boolean {
    return true;
  }

  construct(deps: TokenProvider[]) {
    const construct = async () => {
      deps = await Promise.all(deps);
      return this.useAsyncFactory(...deps);
    };

    return construct();
  }
}
