import {EventEmitter} from "node:events";

import cookie from "cookie";

export class FakeResponse extends EventEmitter {
  headers: Record<string, unknown> = {};
  locals: Record<string, unknown> = {};
  statusCode: number = 200;
  data: any;

  constructor(opts = {}) {
    super();

    Object.assign(this, opts);
  }

  append(field: string, val: string | string[]) {
    const prev = this.get(field);
    let value = val;

    if (prev) {
      // concat the new and prev vals
      value = Array.isArray(prev) ? prev.concat(val) : Array.isArray(val) ? [prev].concat(val) : [prev, val];
    }

    return this.set(field, value);
  }

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  contentType(content: string) {
    this.set("content-type", content);
  }

  contentLength(content: number) {
    this.set("content-length", content);
  }

  cookie(name: string, value: string, options?: TsED.SetCookieOpts) {
    const opts = {...options};

    const val = typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

    if (opts.maxAge != null) {
      const maxAge = opts.maxAge - 0;

      if (!isNaN(maxAge)) {
        opts.expires = new Date(Date.now() + maxAge);
        opts.maxAge = Math.floor(maxAge / 1000);
      }
    }

    if (opts.path == null) {
      opts.path = "/";
    }

    this.append("Set-Cookie", cookie.serialize(name, String(val), opts));

    return this;
  }

  clearCookie(name: string, options?: TsED.SetCookieOpts) {
    const opts = {path: "/", ...options, expires: new Date(1)};
    delete opts.maxAge;
    return this.cookie(name, "", opts);
  }

  redirect(status: number, path: string) {
    this.statusCode = status;
    this.set("location", path);
  }

  location(path: string) {
    this.set("location", path);
  }

  get(key: string) {
    return this.headers[key.toLowerCase()];
  }

  getHeaders() {
    return this.headers;
  }

  set(key: string, value: any) {
    this.headers[key.toLowerCase()] = value;
    return this;
  }

  setHeader(key: string, value: any) {
    this.headers[key.toLowerCase()] = value;
    return this;
  }

  send(data: any) {
    this.data = data;
  }

  json(data: any) {
    this.data = data;
  }

  write(chunk: any) {
    this.emit("data", chunk);
  }

  end(data: any) {
    data !== undefined && (this.data = data);

    this.emit("end");
  }
}
