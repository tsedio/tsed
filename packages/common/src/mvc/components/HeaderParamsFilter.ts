import {Filter, IFilter} from "../../filters";

@Filter()
export class HeaderParamsFilter implements IFilter {
  constructor() {}

  transform(expression: string, request: any, response: any) {
    return request.get(expression);
  }
}
