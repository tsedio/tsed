import {Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res} from "@tsed/common";

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class CustomerGEHMiddleware extends GlobalErrorHandlerMiddleware {

  use(@Err() error: any,
      @Req() request: Req,
      @Res() response: Res): any {

    // DO SOMETHING
    console.error("==============================");

    return super.use(error, request, response);
  }
}
