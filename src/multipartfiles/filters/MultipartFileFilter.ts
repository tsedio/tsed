/**
 * @module multiparfiles
 */
/** */
import {IFilter} from "../../filters/interfaces";
import {Filter} from "../../filters/decorators/filter";
/**
 * @private
 */
@Filter()
export class MultipartFileFilter implements IFilter {
    transform(expression: string, request, response) {
        return request["files"][0];
    }
}
/**
 * @private
 */
@Filter()
export class MultipartFilesFilter implements IFilter {
    transform(expression: string, request, response) {
        return request["files"];
    }
}