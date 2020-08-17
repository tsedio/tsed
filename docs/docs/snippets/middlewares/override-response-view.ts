import {EndpointInfo, Res, ResponseViewMiddleware} from "@tsed/common";
import {Context} from "@tsed/common/src/platform/decorators/context";
import {OverrideProvider} from "@tsed/di";

@OverrideProvider(ResponseViewMiddleware)
export class MyResponseViewMiddleware extends ResponseViewMiddleware {
  public use(
    @Context() ctx: Context,
    @EndpointInfo() endpoint: EndpointInfo,
    @Res() response: Res
  ): any {
    const data = ctx.data;
    // DO SOMETHING

    return super.use(data, endpoint, response);
  }
}
