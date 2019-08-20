/**
 * ServerLoader lifecycle let you intercept a phase.
 */
export interface IServerLifecycle {
  version: any;

  /**
   * This method is called when the server starting his lifecycle.
   */
  $onInit?(): void | Promise<any>;

  $beforeRoutesInit?: Function;
  /**
   * @deprecated
   */
  $onMountingMiddlewares?: Function;
  $afterRoutesInit?: Function;
  $onReady?: Function;

  $onServerInitError?(error: any): any;
}
