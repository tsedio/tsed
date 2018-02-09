import {Filter} from "../../common/filters/decorators/filter";
import {IFilter} from "../../common/filters/interfaces";

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