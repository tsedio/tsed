import {IHooks} from "../../platform-builder";

export interface IServerLifecycle extends IHooks {
  version: any;

  /**
   * This method is called when the server starting his lifecycle.
   * @deprecated use $beforeInit
   */
  $onInit?(): void | Promise<any>;

  /**
   * @deprecated use $beforeRoutesInit instead
   */
  $onMountingMiddlewares?(): void | Promise<any>;

  /**
   * @deprecated use $afterRoutesInit
   */
  $onRoutesInit?(): void | Promise<any>;

  /**
   * @deprecated use $onReady
   */
  $onServerReady?(): void | Promise<any>;

  /**
   * @deprecated will be removed in favor of promise rejection
   */
  $onServerInitError?(error: any): any;
}
