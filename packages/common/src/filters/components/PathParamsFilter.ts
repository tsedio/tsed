import {Filter} from "../decorators/filter";
import {IFilter} from "../interfaces";
import {ParseService} from "../services/ParseService";

/**
 * @private
 * @filter
 */
@Filter()
export class PathParamsFilter implements IFilter {
  constructor(private parseService: ParseService) {}

  transform(expression: string, request: any, response: any) {
    const value = request["params"][expression];

    return value === undefined ? this.parseService.eval(expression, request["params"]) : request["params"][expression];
  }
}
