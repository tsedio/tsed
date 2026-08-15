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
    const body = this.raw.body;

    return body instanceof FormData ? Object.fromEntries(body.entries()) : body;
  }

  get rawBody() {
    return this.raw.rawBody;
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
    const values = ([] as string[]).concat(mime as any);
    const rawAccepted: string = this.get("accept") || "*/*";
    const accepted = rawAccepted
      .split(",")
      .map((value) => {
        const [type, ...parameters] = value.trim().split(";");
        const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));

        return {type, quality: quality ? Number(quality.trim().slice(2)) : 1};
      })
      .sort((left, right) => right.quality - left.quality);
    const match = accepted.map(({type}) => values.find((value) => type === "*/*" || type === value || type === `${value}/*`)).find(Boolean);

    return match || false;
  }

  isAborted() {
    return this.raw.request.signal.aborted;
  }

  getReq(): any {
    return this.raw.request;
  }
}
