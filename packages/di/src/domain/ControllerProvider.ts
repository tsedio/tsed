import {ControllerMiddlewares} from "../decorators/controller";
import {TokenProvider} from "../interfaces/TokenProvider";
import {Provider} from "./Provider";
import {ProviderType} from "./ProviderType";

export class ControllerProvider<T = any> extends Provider<T> {
  public tokenRouter: string;

  constructor(provide: TokenProvider, options: Partial<Provider> = {}) {
    super(provide, options);
    this.type = ProviderType.CONTROLLER;
  }

  /**
   *
   * @returns {any[]}
   */
  get middlewares(): ControllerMiddlewares {
    return Object.assign(
      {
        use: [],
        useAfter: [],
        useBefore: []
      },
      this.store.get("middlewares", {})
    );
  }

  /**
   *
   * @param middlewares
   */
  set middlewares(middlewares: ControllerMiddlewares) {
    const mdlwrs = this.middlewares;
    const concat = (key: string, a: any, b: any) => (a[key] = a[key].concat(b[key]));

    Object.keys(middlewares).forEach((key: string) => {
      concat(key, mdlwrs, middlewares);
    });

    this.store.set("middlewares", mdlwrs);
  }
}
