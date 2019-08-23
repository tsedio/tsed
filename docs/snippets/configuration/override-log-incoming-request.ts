import {LogIncomingRequestMiddleware, OverrideProvider, Req} from "@tsed/common";

@OverrideProvider(LogIncomingRequestMiddleware)
export class CustomLogIncomingRequestMiddleware extends LogIncomingRequestMiddleware {

  public use(@Req() request: any) {

    // you can set a custom ID with another lib
    request.id = require("uuid").v4();

    return super.use(request); // required
  }

  protected requestToObject(request: any) {
    return {
      reqId: request.id,
      method: request.method,
      url: request.originalUrl || request.url,
      duration: new Date().getTime() - request.tsedReqStart.getTime(),
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params
    };
  }
}
