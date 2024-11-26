import {TokenProvider} from "../interfaces/TokenProvider.js";
import {Provider} from "./Provider.js";
import {ProviderType} from "./ProviderType.js";

export interface ControllerMiddlewares {
  useBefore: TokenProvider[];
  use: TokenProvider[];
  useAfter: TokenProvider[];
}

export class ControllerProvider<T = any> extends Provider<T> {
  public tokenRouter: string;

  constructor(token: TokenProvider, options: Partial<Provider> = {}) {
    super(token, options);
    this.type = ProviderType.CONTROLLER;
  }

  /**
   *
   * @returns {any[]}
   */
  get middlewares(): Partial<ControllerMiddlewares> {
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
  set middlewares(middlewares: Partial<ControllerMiddlewares>) {
    const mdlwrs = this.middlewares;
    const concat = (key: string, a: any, b: any) => (a[key] = a[key].concat(b[key]));

    Object.keys(middlewares).forEach((key: string) => {
      concat(key, mdlwrs, middlewares);
    });

    this.store.set("middlewares", mdlwrs);
  }
}
