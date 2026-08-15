import contentDisposition from "content-disposition";
import {PlatformContext, PlatformResponse} from "@tsed/platform-http";

export class PlatformElysiaResponse extends PlatformResponse<any> {
  private done = false;

  constructor($ctx: PlatformContext) {
    super($ctx);
    this.raw.locals ||= {};
    this.raw.set.headers ||= {};
  }

  get statusCode() {
    return Number(this.raw.set.status || 200);
  }

  get locals() {
    return this.raw.locals;
  }

  get(name: string) {
    return this.raw.set.headers[name.toLowerCase()];
  }

  getHeaders() {
    return this.raw.set.headers;
  }

  getRes(): any {
    return this.raw;
  }

  status(status: number) {
    this.raw.set.status = status;
    return this;
  }

  setHeader(key: string, value: any) {
    this.raw.set.headers[key.toLowerCase()] = this.formatHeader(key, value);
    return this;
  }

  contentType(contentType: string) {
    return this.setHeader("content-type", contentType);
  }

  attachment(filename: string) {
    return this.setHeader("content-disposition", contentDisposition(filename));
  }

  stream(data: any) {
    return this.end(data);
  }

  cookie(name: string, value: string | null, opts: TsED.SetCookieOpts = {}) {
    const attributes = Object.entries(opts)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => `; ${key}=${item}`)
      .join("");
    const cookie = `${name}=${value ?? ""}${value === null ? "; Max-Age=0" : ""}${attributes}`;
    const previous = this.get("set-cookie");
    return this.setHeader("set-cookie", previous ? ([] as string[]).concat(previous, cookie) : cookie);
  }

  isDone() {
    return this.done || this.$ctx.isFinished();
  }

  isHeadersSent() {
    return this.done;
  }

  protected json(data: any) {
    if (!this.get("content-type")) {
      this.contentType("application/json; charset=utf-8");
    }
    return this.end(data);
  }

  protected end(data?: any) {
    this.data = data;
    this.done = true;
    return this;
  }
}
