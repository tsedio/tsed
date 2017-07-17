import {Filter} from "../../filters/decorators/filter";
/**
 * @module multiparfiles
 */
/** */
import {IFilter} from "../../filters/interfaces";
/**
 * @private
 * @filter
 */
@Filter()
export class MultipartFileFilter implements IFilter {
    transform(expression: string, request, response) {
        return request["files"][0];
    }
}