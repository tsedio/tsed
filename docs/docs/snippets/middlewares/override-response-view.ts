import {EndpointInfo, Res, ResponseData, ResponseViewMiddleware} from "@tsed/common";
import {OverrideProvider} from "@tsed/di";

@OverrideProvider(ResponseViewMiddleware)
export class MyResponseViewMiddleware extends ResponseViewMiddleware {
  public use(
    @ResponseData() data: any,
    @EndpointInfo() endpoint: EndpointInfo,
    @Res() response: Res
  ): any {

    // DO SOMETHING

    return super.use(data, endpoint, response);
  }
}
