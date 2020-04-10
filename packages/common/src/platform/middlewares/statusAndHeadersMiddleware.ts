import {Next} from "../../mvc/decorators/params/next";
import {Req} from "../../mvc/decorators/params/request";
import {Res} from "../../mvc/decorators/params/response";

export function statusAndHeadersMiddleware(request: Req, response: Res, next: Next) {
  const {
    statusCode,
    response: {headers = {}}
  } = request.ctx.endpoint;

  if (response.statusCode === 200) {
    // apply status only if the isn't already modified
    response.status(statusCode);
  }

  // apply headers
  Object.entries(headers).forEach(([key, schema]) => {
    schema.value !== undefined && response.set(key, String(schema.value));
  });
  next();
}
