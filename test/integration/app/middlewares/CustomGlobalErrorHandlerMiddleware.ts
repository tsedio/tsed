import {Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res} from "@tsed/common";

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class MyGEHMiddleware extends GlobalErrorHandlerMiddleware {

  use(@Err() error: any,
      @Req() request: Req,
      @Res() response: Res): any {

    // DO SOMETHING

    return super.use(error, request, response);
  }
}
