import {getValue, isEmpty} from "@tsed/core";
import {Service} from "@tsed/di";

/**
 *
 */
@Service()
export class ParseService {
  constructor() {}

  /**
   * Clone an object.
   * @param src
   */
  static clone = (src: any): any => JSON.parse(JSON.stringify(src));

  /**
   * Eval an expression with a scope context and return value.
   * @param expression
   * @param scope
   * @param clone
   * @returns {any}
   */
  eval(expression: string, scope: any, clone: boolean = true): any {
    if (isEmpty(expression)) {
      return typeof scope === "object" && clone ? ParseService.clone(scope) : scope;
    }

    const value = getValue(expression, scope);

    return typeof value === "object" && clone ? ParseService.clone(value) : value;
  }
}
