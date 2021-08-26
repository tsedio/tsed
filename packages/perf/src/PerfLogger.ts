import {classOf, descriptorOf, isPromise, methodsOf, nameOf} from "@tsed/core";
import chalk from "chalk";

const loggers = new Map();

export type LEVELS = Record<number, "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray">;

function now() {
  return process.hrtime.bigint();
}

function toMs(time: bigint) {
  return Math.round(Number(time) / 1000) / 1000;
}

function fromNow(time: bigint) {
  return toMs(now() - time);
}

// istanbul ignore next
export class PerfLogger {
  #latest: bigint = process.hrtime.bigint();
  #enabled: boolean = false;
  #start: bigint;

  constructor(readonly label: string = "perf", readonly levels: LEVELS = {10: "green", 50: "yellow", 100: "red"}) {
    this.wrap = this.wrap.bind(this);
    this.log = this.log.bind(this);
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.bind = this.bind.bind(this);
  }

  static get(label: string) {
    if (loggers.get(label)) {
      return loggers.get(label);
    }

    const logger = loggers.get(label) || new PerfLogger(label);

    loggers.set(label, logger);

    return logger;
  }

  start() {
    this.#enabled = true;
    this.#start = this.#latest = now();

    return this;
  }

  log(...args: any[]) {
    if (this.#enabled) {
      console.debug(this.formatLog(["LOG   -", ...args], fromNow(this.#latest), "from latest: "));
      this.#latest = now();
    }

    return this;
  }

  bind(instance: any) {
    const methods = methodsOf(classOf(instance));
    const {wrap, log} = this;

    methods.forEach(({target, propertyKey}) => {
      const descriptor = descriptorOf(target, propertyKey);
      const name = nameOf(target);

      if (descriptor.value) {
        const fn = instance[propertyKey].bind(instance);
        if (propertyKey === "log") {
          instance[propertyKey] = (...args: any[]) => {
            log(...args);
            return fn(...args);
          };
        } else {
          instance[propertyKey] = (...args: any[]) => {
            return wrap(() => fn(...args), `${name}.${propertyKey}()`);
          };
        }
      }
    });

    return instance;
  }

  wrap(fn: Function, name = nameOf(fn)) {
    const date = now();

    if (this.#enabled) {
      console.debug(this.formatLog([`START - ${name}`], fromNow(this.#latest), "from latest: "));
    }

    const result = fn();

    if (this.#enabled) {
      const log = () => {
        if (this.#enabled) {
          console.debug(this.formatLog([`END   - ${name}`], fromNow(date), "method: "));
          this.#latest = now();
        }
      };

      if (isPromise(result)) {
        return result.then((result: any) => {
          log();
          return result;
        });
      }

      log();
    }

    return result;
  }

  end() {
    if (this.#enabled) {
      console.debug(this.formatLog(["ending"], fromNow(this.#start), "from start: "));
      this.#enabled = false;
    }

    return this;
  }

  private formatLog(log: any[], diff: number, wrap = "") {
    const dataLog = log.join(" ") + "                                                                                    ";
    const diffLabel = this.formatDiff(diff, wrap);
    const fromStart = fromNow(this.#start);
    const globalDiff = ("     " + fromStart.toFixed(3) + "ms").slice(-10);

    return `[${this.label}] ${globalDiff} - ${String(dataLog)}`.slice(0, 80) + ` ${diffLabel}`;
  }

  private formatDiff(diff: number, prefix = "") {
    const label = `(${prefix}+${diff}ms)`;
    const list = Object.entries(this.levels);

    const [, color] = list.find(([level]) => diff <= +level) || list[list.length - 1];

    return (chalk as any)[color](label);
  }
}
