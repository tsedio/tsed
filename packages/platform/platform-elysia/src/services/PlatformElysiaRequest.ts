import {PlatformRequest} from "@tsed/platform-http";
import qs from "qs";

export class PlatformElysiaRequest extends PlatformRequest<any> {
  get host() {
    return new URL(this.raw.request.url).host;
  }

  get protocol() {
    return new URL(this.raw.request.url).protocol.replace(":", "");
  }

  get secure() {
    return this.protocol === "https";
  }

  get url() {
    const url = new URL(this.raw.request.url);
    return `${url.pathname}${url.search}`;
  }

  get headers() {
    return Object.fromEntries(this.raw.request.headers.entries());
  }

  get method() {
    return this.raw.request.method;
  }

  get body() {
    return this.raw.body;
  }

  get rawBody() {
    return this.raw.body;
  }

  get cookies() {
    return Object.fromEntries(Object.entries(this.raw.cookie || {}).map(([key, value]: any) => [key, value?.value ?? value]));
  }

  get params() {
    return this.raw.params || {};
  }

  get query() {
    return qs.parse(new URL(this.raw.request.url).search.slice(1));
  }

  get(name: string) {
    return this.raw.request.headers.get(name) || undefined;
  }

  accepts(mime: string): string | false;

  accepts(mime: string[]): string[] | false;

  accepts(mime?: string | string[]): string | string[] | false {
    const accepted = this.get("accept") || "*/*";
    const values = ([] as string[]).concat(mime as any);
    const match = values.find((value) => accepted.includes(value) || accepted.includes("*/*"));

    return match || false;
  }

  isAborted() {
    return this.raw.request.signal.aborted;
  }

  getReq(): any {
    return this.raw.request;
  }
}
