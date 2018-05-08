/**
 * @module common/filters
 */
/** */

import {Filter} from "../decorators/filter";
import {IFilter} from "../interfaces";
/**
 * @private
 * @filter
 */
@Filter()
export class HeaderParamsFilter implements IFilter {
  constructor() {}

  transform(expression: string, request: any, response: any) {
    return request.get(expression);
  }
}
