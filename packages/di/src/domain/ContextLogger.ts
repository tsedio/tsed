import {levels, LogLevel} from "@tsed/logger";

export interface ContextLoggerOptions extends Record<string, any> {
  id: string;
  dateStart?: Date;
  level?: "debug" | "info" | "warn" | "error" | "off" | "all";
  maxStackSize?: number;
  minimalRequestPicker?: (o: any) => any;
  completeRequestPicker?: (o: any) => any;
  ignoreLog?: (data: any) => boolean;
  additionalProps?: Record<any, any>;
}

export class ContextLogger {
  maxStackSize: number;

  readonly #id: string;
  readonly #additionalProps: Record<string, unknown>;
  readonly #dateStart: Date;
  minimalRequestPicker: Function;
  completeRequestPicker: Function;
  readonly #ignoreLog: (data: any) => boolean;
  #stack: any = [];
  #level: LogLevel;

  constructor(
    private logger: any,
    {
      id,
      dateStart = new Date(),
      ignoreUrlPatterns = [],
      minimalRequestPicker,
      completeRequestPicker,
      level = "all",
      maxStackSize = 30,
      ignoreLog,
      additionalProps
    }: ContextLoggerOptions
  ) {
    this.#id = id;
    this.#additionalProps = additionalProps || {};
    this.#dateStart = dateStart;
    this.#ignoreLog = ignoreLog || (() => false);
    this.minimalRequestPicker = minimalRequestPicker || ((l: any) => l);
    this.completeRequestPicker = completeRequestPicker || ((l: any) => l);
    // @ts-ignore
    this.#level = levels()[level.toUpperCase()] || levels().ALL;
    this.maxStackSize = maxStackSize;
  }

  info(obj: any) {
    this.run(levels().INFO, obj, (obj) => this.minimalRequestPicker(this.getData(obj)));
    return this;
  }

  debug(obj: any, withRequest: boolean = true) {
    this.run(levels().DEBUG, obj, (obj) => {
      obj = this.getData(obj);
      return withRequest ? this.completeRequestPicker(obj) : obj;
    });
    return this;
  }

  warn(obj: any) {
    this.run(levels().WARN, obj, (obj) => this.completeRequestPicker(this.getData(obj)));
    return this;
  }

  error(obj: any) {
    this.run(levels().ERROR, obj, (obj) => this.completeRequestPicker(this.getData(obj)));
    return this;
  }

  trace(obj: any) {
    this.run(levels().TRACE, obj, (obj) => this.completeRequestPicker(this.getData(obj)));
    return this;
  }

  public flush() {
    if (this.#stack.length) {
      this.#stack.forEach(({level, data}: any) => {
        this.logger[level](data);
      });

      this.#stack = [];
    }
  }

  public isLevelEnabled(otherLevel: string | LogLevel) {
    return this.#level.isLessThanOrEqualTo(otherLevel);
  }

  destroy() {
    this.flush();

    this.logger = undefined;
    this.#stack = undefined;
  }

  /**
   * Return the duration between the time when LogIncomingRequest has handle the request and now.
   * @returns {number}
   */
  protected getDuration(): number {
    return new Date().getTime() - this.#dateStart.getTime();
  }

  protected getData(obj: any) {
    if (typeof obj === "string") {
      obj = {message: obj};
    }

    return {...this.#additionalProps, reqId: this.#id, time: new Date(), duration: this.getDuration(), ...obj};
  }

  protected run(level: LogLevel, obj: any, mapper: (data: any) => any) {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    if (!this.#ignoreLog(obj)) {
      this.#stack.push({level: level.levelStr.toLowerCase(), data: mapper(obj)});
    }

    if (this.maxStackSize < this.#stack.length) {
      this.flush();
    }
  }
}
