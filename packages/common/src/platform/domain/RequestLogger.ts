import {levels, LogLevel} from "@tsed/logger";

export class RequestLogger {
  readonly id: string;
  readonly url: string;
  readonly startDate: Date;
  public maxStackSize: number;
  public minimalRequestPicker: Function;
  public completeRequestPicker: Function;
  private readonly ignoreUrlPatterns: any[];
  private stack: any = [];
  private level: LogLevel;

  constructor(
    private logger: any,
    {id, startDate, url, ignoreUrlPatterns = [], minimalRequestPicker, completeRequestPicker, level = "all", maxStackSize = 30}: any
  ) {
    this.id = id;
    this.url = url;
    this.startDate = startDate;
    this.ignoreUrlPatterns = ignoreUrlPatterns.map((pattern: string | RegExp) =>
      typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern
    );

    this.minimalRequestPicker = minimalRequestPicker || ((l: any) => l);
    this.completeRequestPicker = completeRequestPicker || ((l: any) => l);
    // @ts-ignore
    this.level = levels()[level.toUpperCase()] || levels().ALL;
    this.maxStackSize = maxStackSize;
  }

  info(obj: any) {
    this.run(levels().INFO, () => {
      const data = this.minimalRequestPicker(this.getData(obj));
      this.stack.push({level: "info", data});
    });
  }

  debug(obj: any, withRequest: boolean = true) {
    this.run(levels().DEBUG, () => {
      obj = this.getData(obj);
      const data = withRequest ? this.completeRequestPicker(obj) : obj;
      this.stack.push({level: "debug", data});
    });
  }

  warn(obj: any) {
    this.run(levels().WARN, () => {
      const data = this.completeRequestPicker(this.getData(obj));
      this.stack.push({level: "warn", data});
    });
  }

  error(obj: any) {
    this.run(levels().ERROR, () => {
      const data = this.completeRequestPicker(this.getData(obj));
      this.stack.push({level: "error", data});
    });
  }

  trace(obj: any) {
    this.run(levels().TRACE, () => {
      const data = this.completeRequestPicker(this.getData(obj));
      this.stack.push({level: "trace", data});
    });
  }

  public flush() {
    if (this.stack.length) {
      this.stack.forEach(({level, data}: any) => {
        this.logger[level](data);
      });

      this.stack = [];
    }
  }

  public isLevelEnabled(otherLevel: string | LogLevel) {
    return this.level.isLessThanOrEqualTo(otherLevel);
  }

  destroy() {
    this.flush();
    delete this.logger;
    delete this.stack;
    // @ts-ignore
    delete this.minimalRequestPicker;
    // @ts-ignore
    delete this.completeRequestPicker;
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

  protected run(level: LogLevel, cb: Function) {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    const match = this.ignoreUrlPatterns.find(reg => !!this.url.match(reg));

    !match && cb();

    if (this.maxStackSize < this.stack.length) {
      this.flush();
    }
  }
}
