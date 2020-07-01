import {Next} from "../../mvc/decorators/params/next";
import {Req} from "../../mvc/decorators/params/request";
import {Res} from "../../mvc/decorators/params/response";

export function statusAndHeadersMiddleware(request: Req, response: Res, next: Next) {
  const operation = request.ctx.endpoint.operation;

  if (response.statusCode === 200) {
    // apply status only if the isn't already modified
    response.status(operation.getStatus());
  }

  const headers = operation.getHeadersOf(response.statusCode);

  Object.entries(headers).forEach(([key, schema]) => {
    schema.example !== undefined && response.set(key, String(schema.example));
  });

  next();
}
