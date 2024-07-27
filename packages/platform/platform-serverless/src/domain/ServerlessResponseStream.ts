import type {APIGatewayProxyEventV2, Callback, Context, Handler} from "aws-lambda";
import {Stream} from "node:stream";
import {isInAWS} from "../utils/isInAWS";

export type ServerlessResponseMeta = {statusCode: number; headers: Record<string, string>};

declare global {
  const awsLambda: {
    streamifyResponse(handler: Handler): unknown | Promise<unknown>;
    HttpResponseStream: {
      from(resStream: ServerlessResponseStream | unknown, meta: ServerlessResponseMeta): ServerlessResponseStream;
    };
  };
}

export type RequestHandler = (
  ev: APIGatewayProxyEventV2,
  streamResponse: ServerlessResponseStream,
  ctx?: Context,
  callback?: Callback
) => unknown | Promise<unknown>;

export class ServerlessResponseStream extends Stream.Writable {
  public _meta: ServerlessResponseMeta = {statusCode: 200, headers: {}};
  #response: Buffer[];

  constructor() {
    super();
    this.#response = [];
  }

  static setMeta(resStream: ServerlessResponseStream, meta: ServerlessResponseMeta) {
    if (isInAWS()) {
      // @ts-ignore
      return awslambda.HttpResponseStream.from(resStream, meta);
    }

    resStream.setMeta(meta);

    return resStream;
  }

  static streamifyResponse(handler: RequestHandler): RequestHandler {
    // Check for global awslambda
    if (isInAWS()) {
      // @ts-ignore
      return awslambda.streamifyResponse(handler);
    } else {
      return async (event, response, context) => {
        const args: any[] = patchArgs([event, response, context]);
        const responseStream: ServerlessResponseStream = args[1];

        await (handler as any)(...args);

        return {
          ...responseStream._meta,
          body: responseStream.getBufferedData().toString()
        };
      };
    }
  }

  // streams, `chunk` may be any JavaScript value.
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.#response.push(Buffer.from(chunk, encoding));
    callback();
  }

  setMeta(meta: ServerlessResponseMeta) {
    this._meta = meta;
  }

  getBufferedData(): Buffer {
    return Buffer.concat(this.#response);
  }
}

function patchArgs(args: any[]) {
  if (!(args[1] instanceof ServerlessResponseStream)) {
    const responseStream = new ServerlessResponseStream();

    return [args[0], responseStream, ...args.splice(1, -1)];
  }

  return args;
}
