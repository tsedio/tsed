import {Stream} from "node:stream";

import type {APIGatewayProxyEventV2, Callback, Context, Handler} from "aws-lambda";

import {isInAWS} from "../utils/isInAWS.js";

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
  streamResponse?: ServerlessResponseStream,
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
      return awslambda.streamifyResponse(
        async (event: APIGatewayProxyEventV2, responseStream: ServerlessResponseStream | Context | undefined, context?: Context) => {
          const isFallbackMode = context === undefined;

          if (context === undefined) {
            context = responseStream as Context;
            responseStream = new ServerlessResponseStream();

            console.warn({
              event: "WRONG_AWS_STREAM_CONFIGURATION",
              message:
                "The lambda didn't receive a ResponseStream from AWS. Ts.ED therefore generated a ServerlessResponseStream as a fallback. This mode is not optimized for use in PRODUCTION. Please check the AWS configuration of your lambda."
            });
          }

          await handler(event, responseStream as ServerlessResponseStream, context);

          if (isFallbackMode) {
            return ServerlessResponseStream.buildResponse(responseStream as ServerlessResponseStream);
          }
        }
      );
    } else {
      return async (event, response, context) => {
        const args: any[] = patchArgs([event, response, context]);
        const responseStream: ServerlessResponseStream = args[1];

        await (handler as any)(...args);

        return ServerlessResponseStream.buildResponse(responseStream);
      };
    }
  }

  private static buildResponse(responseStream: ServerlessResponseStream) {
    return {
      ...responseStream._meta,
      body: responseStream.getBufferedData().toString()
    };
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
