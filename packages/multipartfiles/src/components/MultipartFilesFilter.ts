import {Filter, IFilter} from "@tsed/common";
import {getValue} from "@tsed/core";

/**
 * @private
 * @filter
 */
@Filter()
export class MultipartFilesFilter implements IFilter {
  transform(expression: string, request: any, response: any) {
    if (expression) {
      return request["files"] && getValue(expression, request["files"]);
    }

    return request["files"];
  }
}
