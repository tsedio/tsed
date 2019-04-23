export class RequestLogger {
  readonly id: string;
  readonly url: string;
  readonly startDate: Date;
  private readonly ignoreUrlPatterns: any[];
  private readonly minimalRequestPicker: Function;
  private readonly completeRequestPicker: Function;
  private stack: any = [];

  constructor(private logger: any, {id, startDate, url, ignoreUrlPatterns, minimalRequestPicker, completeRequestPicker}: any) {
    this.id = id;
    this.url = url;
    this.startDate = startDate;
    this.ignoreUrlPatterns = ignoreUrlPatterns.map((pattern: string | RegExp) =>
      typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern
    );

    this.minimalRequestPicker = minimalRequestPicker;
    this.completeRequestPicker = completeRequestPicker;
  }

  info(obj: any) {
    this.run(() => {
      const data = this.minimalRequestPicker(this.getData(obj));
      this.stack.push({level: "info", data});
    });
  }

  debug(obj: any, withRequest: boolean = true) {
    this.run(() => {
      obj = this.getData(obj);
      const data = withRequest ? this.completeRequestPicker(obj) : obj;
      this.stack.push({level: "debug", data});
    });
  }

  warn(obj: any) {
    this.run(() => {
      const data = this.completeRequestPicker(this.getData(obj));
      this.stack.push({level: "warn", data});
    });
  }

  error(obj: any) {
    this.run(() => {
      const data = this.completeRequestPicker(this.getData(obj));
      this.stack.push({level: "error", data});
    });
  }

  trace(obj: any) {
    this.run(() => {
      const data = this.completeRequestPicker(this.getData(obj));
      this.stack.push({level: "trace", data});
    });
  }

  public flush() {
    if (this.stack) {
      this.stack.forEach(({level, data}: any) => {
        this.logger[level](data);
      });
    }
  }

  /**
   * Return the duration between the time when LogIncomingRequest has handle the request and now.
   * @returns {number}
   */
  protected getDuration(): number {
    return new Date().getTime() - this.startDate.getTime();
  }

  protected getData(obj: any) {
    if (typeof obj === "string") {
      obj = {message: obj};
    }

    return {reqId: this.id, time: new Date(), duration: this.getDuration(), ...obj};
  }

  protected run(cb: Function) {
    const match = this.ignoreUrlPatterns.find(reg => !!this.url.match(reg));

    return !match && cb();
  }
}
