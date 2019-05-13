import {OverrideProvider, Res, ResponseData, SendResponseMiddleware} from "@tsed/common";

@OverrideProvider(SendResponseMiddleware)
export class MySendResponseMiddleware extends SendResponseMiddleware {
  public use(@ResponseData() data: any, @Res() response: Res): any {

    const originalResult = super.use(data, response);

    // ... your instruction
    return {data: originalResult, errors: []};
  }
}
