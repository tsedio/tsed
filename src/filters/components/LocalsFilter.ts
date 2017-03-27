/**
 * @module filters
 */
/** */

import {Filter} from "../decorators/filter";
import {IFilter} from "../interfaces/index";
import {ParseService} from "../services/ParseService";
/**
 * @private
 */
@Filter()
export class LocalsFilter implements IFilter {

    constructor(private parseService: ParseService) {
    }

    transform(expression: string, request, response) {
        return this.parseService.eval(expression, response["locals"], false);
    }
}