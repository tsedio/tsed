import {EventEmitter} from "node:events";

export class FakeResponse extends EventEmitter {
  headers: Record<string, unknown> = {};
  locals: Record<string, unknown> = {};
  statusCode: number = 200;
  data: any;

  constructor(opts = {}) {
    super();

    Object.assign(this, opts);
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
