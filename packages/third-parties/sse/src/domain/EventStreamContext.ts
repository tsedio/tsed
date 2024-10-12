import {isBoolean, isDate, isNumber, isString} from "@tsed/core";
import {PlatformContext} from "@tsed/platform-http";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import type {EventEmitter} from "events";
import type {Observable} from "rxjs";

import type {EventStreamOpts} from "../decorators/eventStream.js";

export type EventStreamContextOptions = {
  $ctx: PlatformContext;
} & EventStreamOpts;

export class EventStreamContext {
  private $ctx: PlatformContext;
  private opts: EventStreamOpts;
  private responseFilter: PlatformResponseFilter;
  #isDone = false;

  constructor({$ctx, ...opts}: EventStreamContextOptions) {
    this.$ctx = $ctx;

    this.opts = opts;
    this.responseFilter = this.$ctx.injector.get<PlatformResponseFilter>(PlatformResponseFilter)!;
  }

  writeHead(headers: Record<string, string> = {}) {
    console.log("this.$ctx", this.$ctx);
    this.on("end", () => {
      this.$ctx.logger.info({
        event: "SSE_ENDED"
      });
      this.$ctx.getRes().end();
      this.#isDone = true;
    });

    this.on("close", () => {
      this.$ctx.logger.info({
        event: "SSE_CLOSED_BY_CLIENT"
      });
      this.$ctx.getRes().end();
      this.#isDone = true;
    });

    this.$ctx.getRes().writeHead(200, {
      ...this.opts.headers,
      ...headers,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
  }

  on(event: string, listener: (...args: any[]) => void): this {
    this.$ctx.getRes().on(event, listener);
    return this;
  }

  subscribe(observable: Observable<unknown>) {
    observable.subscribe((data) => {
      this.emit(this.opts.event, data);
    });
    return this;
  }

  stream(stream: NodeJS.ReadableStream | EventEmitter) {
    const listener = (data: unknown) => {
      if (this.isDone()) {
        stream.off("data", listener);
      } else {
        this.emit(this.opts.event, data);
      }
    };

    stream.on("data", listener);
  }

  emit(event: string | undefined, data: unknown) {
    if (this.isDone()) {
      return;
    }
    const {$ctx} = this;
    if (data === undefined) {
      return this;
    }

    if (Buffer.isBuffer(data)) {
      data = data.toString("utf8");
    }

    if (isBoolean(data) || isNumber(data) || isString(data) || isDate(data) || data === null) {
      this.write({
        event: event || "",
        data: JSON.stringify(data)
      });
      return this;
    }

    this.responseFilter
      .serialize(data, $ctx as any)
      .then((data: unknown) => {
        return this.responseFilter.transform(data, $ctx as any);
      })
      .then((data: unknown) => {
        data = JSON.stringify(data);

        this.write({
          event: event || "",
          data: data as string
        });
      });

    return this;
  }

  write(obj: Record<string, string>) {
    const values = Object.entries(obj)
      .map(([key, value]) => {
        return `${key}: ${value}`;
      })
      .join("\n");

    this.$ctx.getRes().write(`${values}\n\n`);
  }

  isDone() {
    return this.#isDone;
  }

  end() {
    this.#isDone = true;
    this.$ctx.getRes().end();
  }
}
