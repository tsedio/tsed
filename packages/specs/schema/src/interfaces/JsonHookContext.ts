declare global {
  namespace TsED {
    interface JsonHookContext {}
  }
}

export interface JsonHookContext extends TsED.JsonHookContext {
  /**
   * The current instance used by serializer function
   */
  self: any;
  /**
   *
   */
  groups?: string[] | false;

  [key: string]: any;
}
