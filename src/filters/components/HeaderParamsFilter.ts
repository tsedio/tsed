/**
 * @module filters
 */
/** */

import {IFilter} from "../interfaces";
import {Filter} from "../decorators/filter";
/**
 * @private
 */
@Filter()
export class HeaderParamsFilter implements IFilter {

    constructor() {
    }

    transform(expression: string, request: any, response: any) {
        return request.get(expression);
    }
}