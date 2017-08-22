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
export class MultipartFilesFilter implements IFilter {
    transform(expression: string, request: any, response: any) {
        return request["files"];
    }
}