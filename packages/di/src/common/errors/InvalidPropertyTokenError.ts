import {classOf, nameOf} from "@tsed/core";

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
