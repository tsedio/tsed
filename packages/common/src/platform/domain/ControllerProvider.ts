import {Enumerable, NotEnumerable} from "@tsed/core";
import {Provider, ProviderType, TokenProvider} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {ControllerMiddlewares, EndpointMetadata} from "../../mvc";
import {PlatformRouter} from "../services/PlatformRouter";

const routers: WeakMap<ControllerProvider, PlatformRouter> = new WeakMap();

export class ControllerProvider<T = any> extends Provider<T> {
  @NotEnumerable()
  readonly entity: JsonEntityStore;

  constructor(provide: any) {
    super(provide);
    this.type = ProviderType.CONTROLLER;
    this.entity = JsonEntityStore.from(provide);
  }

  get path() {
    return this.entity.path;
  }

  @Enumerable()
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

  public getRouter(): PlatformRouter {
    return routers.get(this)!;
  }

  public setRouter(router: PlatformRouter) {
    routers.set(this, router);

    return this;
  }
}
