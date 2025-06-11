import {Stream} from "node:stream";
import {pipeline} from "node:stream/promises";

import {isSerializable, isStream} from "@tsed/core";

import {GCPEvent, isHttpEvent} from "./GCPEvent.js";

export type GCPResponseMeta = {statusCode: number; headers: Record<string, string>};

export type RequestHandler = (event: GCPEvent, streamResponse?: GCPResponseStream, context?: any) => unknown | Promise<unknown>;

export class GCPResponseStream extends Stream.Writable {
  public _meta: GCPResponseMeta = {statusCode: 200, headers: {}};
  #response: Buffer[];

  constructor() {
    super();
    this.#response = [];
  }

  static setMeta(resStream: GCPResponseStream, meta: GCPResponseMeta) {
    resStream.setMeta(meta);
    return resStream;
  }

  static streamifyResponse(handler: RequestHandler): RequestHandler {
    return async (event: GCPEvent, responseStream?: GCPResponseStream, context?: any) => {
      if (!responseStream) {
        responseStream = new GCPResponseStream();
      }

      await handler(event, responseStream, context);

      // For HTTP events, we need to pipe the response to the Express response
      if (isHttpEvent(event)) {
        const {res} = event;

        // Set status and headers
        res.status(responseStream._meta.statusCode);

        Object.entries(responseStream._meta.headers).forEach(([key, value]) => {
          res.set(key, value);
        });

        // If we have a buffered response, send it
        const bufferedData = responseStream.getBufferedData();
        if (bufferedData.length > 0) {
          res.send(bufferedData);
        }

        return;
      }

      // For non-HTTP events, return the response
      return GCPResponseStream.buildResponse(responseStream);
    };
  }

  private static buildResponse(responseStream: GCPResponseStream) {
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

  setMeta(meta: GCPResponseMeta) {
    this._meta = meta;
  }

  getBufferedData(): Buffer {
    return Buffer.concat(this.#response);
  }
}
