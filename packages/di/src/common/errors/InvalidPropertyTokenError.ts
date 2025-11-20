import {classOf} from "@tsed/core/utils/classOf.js";
import {nameOf} from "@tsed/core/utils/nameOf.js";

/**
 * Error thrown when an invalid token is used for property injection.
 *
 * Typically indicates a circular reference, missing import, or undefined token
 * in property decorators like `@Inject()` or `@Constant()`.
 *
 * ### Common causes
 *
 * - Circular dependency between classes
 * - Missing or incorrect import statement
 * - Using `undefined` as a token
 * - Forward reference not properly handled
 *
 * @public
 */
export class InvalidPropertyTokenError extends Error {
  name = "INVALID_TOKEN_ERROR";

  constructor(target: any, propertyKey: string) {
    super(
      `Object isn't a valid token. Please check the token set on ${nameOf(
        classOf(target)
      )}.${propertyKey}.\n- Check that it is not a circular reference.\n- Check that the token (class or symbol) exists`
    );
  }
}
