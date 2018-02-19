import {Filter, IFilter} from "@tsed/common";

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