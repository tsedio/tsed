import {Middleware, Res} from "@tsed/common";

@Middleware()
export class NotFoundMiddleware {
  use(@Res() response: Res) {
    return response.status(404).send("Custom 404 HTML PAGE");
  }
}
