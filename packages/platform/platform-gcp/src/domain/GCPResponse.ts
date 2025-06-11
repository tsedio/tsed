import {getValue} from "@tsed/core";
import {getStatusMessage} from "@tsed/schema";
import encodeUrl from "encodeurl";
import mime from "mime";

import {GCPContext} from "./GCPContext.js";
import {GCPEvent, isHttpEvent} from "./GCPEvent.js";

type HeaderValue = string | string[] | number | boolean;

/**
 * @platform
 */
export class GCPResponse<Event extends object = GCPEvent> {
  private _headers: Record<string, HeaderValue> = {};
  private _status: number = 200;
  private _body: any;
  private _done: boolean = false;
  private _locals: Record<string, any> = {};

  constructor(protected $ctx: GCPContext) {}

  get event(): Event {
    return this.$ctx.event as unknown as Event;
  }

  get raw(): any {
    return isHttpEvent(this.event) ? (this.event as any).res : this.event;
  }

  get request() {
    return this.$ctx.request;
  }

  get statusCode(): number {
    return this._status;
  }

  set statusCode(status: number) {
    this._status = status;
  }

  get locals() {
    return this._locals;
  }

  set locals(locals: Record<string, any>) {
    this._locals = locals;
  }

  isHeadersSent(): boolean {
    return this._done;
  }

  getStatus(): number {
    return this._status;
  }

  status(status: number): this {
    this._status = status;

    if (isHttpEvent(this.event)) {
      this.event.res.status(status);
    }

    return this;
  }

  set(name: string, value: HeaderValue): this {
    return this.setHeader(name, value);
  }

  get(name: string): HeaderValue | undefined {
    const key = name.toLowerCase();

    if (this._headers[key] !== undefined) {
      return this._headers[key];
    }

    if (isHttpEvent(this.event)) {
      const value = this.event.res.get(name);
      if (value) {
        return value;
      }
    }

    return undefined;
  }

  getHeaders(): Record<string, HeaderValue> {
    return this._headers;
  }

  hasStatus(): boolean {
    return !!this._status;
  }

  setHeaders(headers: Record<string, HeaderValue>): this {
    if (!headers) {
      return this;
    }

    Object.entries(headers).forEach(([key, item]) => {
      this.setHeader(key, item);
    });

    return this;
  }

  setHeader(key: string, item: HeaderValue): this {
    const headerKey = key.toLowerCase();
    this._headers[headerKey] = item;

    if (isHttpEvent(this.event)) {
      if (Array.isArray(item)) {
        item.forEach((value) => {
          this.event.res.append(key, value);
        });
      } else {
        this.event.res.set(key, String(item));
      }
    }

    return this;
  }

  contentType(contentType: string): this {
    if (contentType.indexOf("/") === -1) {
      const lookup = mime.getType(contentType);

      if (lookup) {
        contentType = lookup;
      }
    }

    return this.set("Content-Type", contentType);
  }

  contentLength(length: number): this {
    return this.set("Content-Length", length);
  }

  getContentLength(): number {
    const length = this.get("Content-Length");
    return length ? +length : 0;
  }

  getContentType(): string | undefined {
    return this.get("Content-Type") as string | undefined;
  }

  redirect(status: number, url: string): this {
    if (typeof status !== "number") {
      url = status as unknown as string;
      status = 302;
    }

    this.status(status);
    this.set("Location", encodeUrl(url));

    if (isHttpEvent(this.event)) {
      this.event.res.redirect(status, url);
    }

    return this;
  }

  location(url: string): this {
    this.set("Location", encodeUrl(url));

    if (isHttpEvent(this.event)) {
      this.event.res.location(url);
    }

    return this;
  }

  body(body: any): this {
    this._body = body;

    if (isHttpEvent(this.event)) {
      if (body === undefined) {
        this.event.res.end();
      } else {
        this.event.res.send(body);
      }
    }

    return this;
  }

  getBody(): any {
    return this._body;
  }

  isDone(): boolean {
    return this._done;
  }

  destroy() {
    this._done = true;
  }
}
