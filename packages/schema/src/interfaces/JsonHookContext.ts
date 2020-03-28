export interface JsonHookContext {
  /**
   * The current instance used by serializer function
   */
  self: any;

  [key: string]: any;
}
