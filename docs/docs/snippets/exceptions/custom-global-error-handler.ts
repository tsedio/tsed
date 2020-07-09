import {Err, Middleware, Req, Res} from "@tsed/common";

@Middleware()
export class GlobalErrorHandlerMiddleware {
  use(@Err() error: any, @Req() request: Req, @Res() response: Res) {
    response.status(error.status || 500).json({
      request_id: request.id,
      status: response.status,
      error_message: error.message
    });
  }
}
