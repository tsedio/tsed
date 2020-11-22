import {Filter, ParseService, Req} from "@tsed/common";
import {OAuthBearerOptions} from "../protocols/BearerStrategy";

@Filter()
export class OAuthParamsFilter {
  constructor(private parseService: ParseService) {
  }

  transform(expression: string, request: Req) {
    const options = request.ctx.endpoint.get(OAuthBearerOptions) || {};
    return this.parseService.eval(expression, options);
  }
}
