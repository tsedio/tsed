import {Hooks} from "@tsed/core";
import {levels, LogLevel} from "@tsed/logger";

import {DILogger} from "../../common/index.js";
import {logger as injectLogger} from "../fn/logger.js";

export interface ContextLoggerOptions extends Record<string, any> {
  id: string;
  logger?: DILogger;
  level?: "debug" | "info" | "warn" | "error" | "off" | "all";
  maxStackSize?: number;
  additionalProps?: Record<any, any>;
}

const LEVELS: Record<string, LogLevel> = levels();

export class ContextLogger {
  readonly dateStart: Date;
  readonly id: string;
  readonly #additionalProps?: Record<string, unknown>;

  maxStackSize: number;
  level: LogLevel;

  #hooks?: Hooks;
  #stack?: any[];
  #logger: any;

  constructor({id, logger, dateStart = new Date(), level = "all", maxStackSize = 30, additionalProps}: ContextLoggerOptions) {
    this.dateStart = dateStart;
    this.id = id;
    this.#logger = logger || injectLogger();
    this.#additionalProps = additionalProps;
    this.level = (LEVELS[level.toUpperCase()] || LEVELS.ALL) as LogLevel;
    this.maxStackSize = maxStackSize;
  }

  get hooks() {
    return (this.#hooks = this.#hooks || new Hooks());
  }

  private get stack() {
    return (this.#stack = this.#stack || []);
  }

  alterLog(cb: (data: any, level: "debug" | "info" | "warn" | "error" | "all", withRequest: boolean) => any) {
    return this.hooks.on("log", cb);
  }

  alterIgnoreLog(cb: (ignore: boolean, data: any) => boolean) {
    return this.hooks.on("ignore", cb);
  }

  info(obj: any) {
    this.run(levels().INFO, obj);
    return this;
  }

  debug(obj: any) {
    this.run(levels().DEBUG, obj);
    return this;
  }

  warn(obj: any) {
    this.run(levels().WARN, obj);
    return this;
  }

  error(obj: any) {
    this.run(levels().ERROR, obj);
    return this;
  }

  fatal(obj: any) {
    this.run(levels().FATAL, obj);
    return this;
  }

  trace(obj: any) {
    this.run(levels().TRACE, obj);
    return this;
  }

  public flush(stream = false) {
    if (this.stack.length) {
      this.stack.forEach(({level, data}: any) => {
        this.#logger[level](data);
      });

      this.#stack = [];
    }

    if (stream) {
      this.maxStackSize = 0;
    }
  }

  public isLevelEnabled(otherLevel: string | LogLevel) {
    return this.level.isLessThanOrEqualTo(otherLevel);
  }

  /**
   * Return the duration between the time when LogIncomingRequest has handle the request and now.
   * @returns {number}
   */
  protected getDuration(): number {
    return new Date().getTime() - this.dateStart.getTime();
  }

  protected getData(obj: any) {
    if (typeof obj === "string") {
      obj = {message: obj};
    }

    return {...this.#additionalProps, reqId: this.id, time: new Date(), duration: this.getDuration(), ...obj};
  }

  protected run(level: LogLevel, obj: any, withRequest?: boolean) {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    const ignore = this.#hooks?.alter("ignore", false, [obj]);

    if (!ignore) {
      const levelStr = level.levelStr.toLowerCase();

      obj = this.hooks.alter("log", this.getData(obj), [levelStr, withRequest]);

      this.stack.push({level: levelStr, data: obj});
    }

    if (this.maxStackSize < this.stack.length || [levels().FATAL, levels().ERROR].includes(level)) {
      this.flush();
    }
  }
}
