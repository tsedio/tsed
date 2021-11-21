import {ControllerMiddlewares, Provider, ProviderType, TokenProvider} from "@tsed/di";
import {ROUTER_OPTIONS} from "../constants/routerOptions";

let AUTO_INC = 0;

export class ControllerProvider<T = any> extends Provider<T> {
  readonly tokenRouter: string;

  constructor(provide: TokenProvider, options: Partial<Provider> = {}) {
    super(provide, options);
    this.type = ProviderType.CONTROLLER;
    this.tokenRouter = `${this.name}_ROUTER_${AUTO_INC++}`;
  }

  /**
   *
   */
  get routerOptions(): any {
    return this.store.get(ROUTER_OPTIONS) || ({} as any);
  }

  /**
   *
   * @param value
   */
  set routerOptions(value: any) {
    this.store.set(ROUTER_OPTIONS, value);
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
