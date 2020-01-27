import {ConverterService, OverrideProvider, Req, Res, SendResponseMiddleware} from "@tsed/common";
import {isStream} from "@tsed/core/src";

@OverrideProvider(SendResponseMiddleware)
export class MySendResponseMiddleware {
  constructor(private converterService: ConverterService) {
  }

  public use(@Req() request: Req, @Res() response: Res): any {
    const {ctx: {data, endpoint}} = request;

    if (data === undefined) {
      return response.send();
    }

    if (isStream(data)) {
      data.pipe(response);

      return response;
    }

    const payload = {
      data: this.converterService.serialize(data, {type: endpoint.type}),
      errors: []
    };

    return response.json(payload);
  }
}
