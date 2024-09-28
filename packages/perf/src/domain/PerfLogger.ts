import {classOf, descriptorOf, methodsOf, nameOf} from "@tsed/core";
import chalk from "chalk";

import {CallbackWrapper, Perf} from "./Perf.js";

const loggers = new Map();

export type LEVELS = Record<number, "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray">;

// istanbul ignore next
export class PerfLogger {
  #perf = new Perf();
  #enabled: boolean = false;

  constructor(
    readonly label: string = "perf",
    readonly levels: LEVELS = {10: "green", 50: "yellow", 100: "red"}
  ) {
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
    this.#perf.start();

    return this;
  }

  log(...args: any[]) {
    if (this.#enabled) {
      console.debug(this.formatLog(["LOG   -", ...args], this.#perf.fromLatest(), "from latest: "));
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

  wrap<T = any>(fn: CallbackWrapper<T>, name = nameOf(fn)): T {
    if (!this.#enabled) {
      return fn();
    }

    console.debug(this.formatLog([`START - ${name}`], this.#perf.fromLatest(), "from latest: "));

    return this.#perf.run(fn, (time) => {
      if (this.#enabled) {
        console.debug(this.formatLog([`END   - ${name}`], time, "method: "));
      }
    });
  }

  end() {
    if (this.#enabled) {
      console.debug(this.formatLog(["ending"], this.#perf.end(), "from start: "));
      this.#enabled = false;
    }

    return this;
  }

  private formatLog(log: any[], diff: number, wrap = "") {
    const dataLog = log.join(" ") + "                                                                                    ";
    const diffLabel = this.formatDiff(diff, wrap);
    const fromStart = this.#perf.fromStart();
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
