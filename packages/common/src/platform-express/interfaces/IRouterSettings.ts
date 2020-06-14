export interface IRouterSettings {
  /**
   * Disabled by default, treating “/Foo” and “/foo” as the same.
   */
  caseSensitive?: boolean;
  /**
   * Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false
   */
  mergeParams?: boolean;
  /**
   * Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.
   */
  strict?: boolean;
}
