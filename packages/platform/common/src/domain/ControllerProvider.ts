import {ControllerMiddlewares, Provider, ProviderType, TokenProvider} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {ROUTER_OPTIONS} from "../constants/routerOptions";
import {PlatformRouterMethods} from "../interfaces/PlatformRouterMethods";
import {EndpointMetadata} from "./EndpointMetadata";

export class ControllerProvider<T = any> extends Provider<T> {
  readonly entity: JsonEntityStore;
  private router: PlatformRouterMethods;

  constructor(provide: TokenProvider, options: Partial<Provider> = {}) {
    super(provide, options);
    this.type = ProviderType.CONTROLLER;
    this.entity = JsonEntityStore.from(provide);
  }

  get path() {
    return this.entity.path;
  }

  set path(path: string) {
    this.entity.path = path;
  }

  /**
   *
   * @returns {EndpointMetadata[]}
   */
  get endpoints(): EndpointMetadata[] {
    return EndpointMetadata.getEndpoints(this.provide);
  }

  get children(): TokenProvider[] {
    return this.store.get("childrenControllers", []);
  }

  /**
   *
   * @returns {ControllerProvider}
   */
  get parent(): TokenProvider | undefined {
    return this.store.get("parentController");
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

  /**
   *
   * @returns {boolean}
   */
  public hasChildren(): boolean {
    return !!this.children.length;
  }

  /**
   *
   * @returns {boolean}
   */
  public hasParent(): boolean {
    return !!this.store.get("parentController");
  }

  public getRouter<T extends PlatformRouterMethods = any>(): T {
    return this.router as any;
  }

  public setRouter(router: PlatformRouterMethods) {
    this.router = router;

    return this;
  }
}
