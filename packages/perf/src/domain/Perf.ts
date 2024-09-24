import {isPromise} from "@tsed/core";

import {fromNow, now} from "../utils/utils.js";

export type CallbackWrapper<T = any> = (...args: any[]) => T;

// istanbul ignore next
export class Perf {
  #latest: bigint;
  #start: bigint;

  constructor() {
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.run = this.run.bind(this);
    this.fromStart = this.fromStart.bind(this);
    this.fromLatest = this.fromLatest.bind(this);
  }

  start() {
    this.#start = this.#latest = now();

    return this;
  }

  async runFor<T = any>(it: number, fn: CallbackWrapper<T>) {
    const {time} = await this.run(async () => {
      for (let i = 0; i < it; i++) {
        await fn();
      }
    });

    return time;
  }

  run<T = any>(fn: CallbackWrapper<T>): {result: T; time: number} | Promise<{result: T; time: number}>;
  run<T = any>(fn: CallbackWrapper<T>, onTime: (time: number) => void): T;
  run<T = any>(fn: CallbackWrapper<T>, onTime?: (time: number) => void) {
    const date = now();

    const result = fn();

    const getDiff = (result: any) => {
      const diff = fromNow(date);
      this.#latest = now();

      onTime && onTime(diff);

      return onTime ? result : {result, time: diff};
    };

    if (isPromise(result)) {
      return result.then(getDiff);
    }

    return getDiff(result);
  }

  fromStart() {
    return fromNow(this.#start);
  }

  fromLatest() {
    const diff = fromNow(this.#latest);
    this.#latest = now();
    return diff;
  }

  end() {
    const diff = fromNow(this.#start);
    this.#start = this.#latest = now();
    return diff;
  }
}
