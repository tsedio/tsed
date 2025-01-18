import {IncomingMessage, ServerResponse} from "node:http";

export interface IncomingEvent<Req = IncomingMessage, Res = ServerResponse> extends Record<string, unknown> {
  response: Res;
  request: Req;
}
