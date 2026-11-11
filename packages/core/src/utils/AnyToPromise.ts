import {isObject} from "./isObject.js";
import {isObservable} from "./isObservable.js";
import {isPromise} from "./isPromise.js";
import {isStream} from "./isStream.js";
import type {MaybePromise} from "../types/MaybePromise.js";

/**
 * @ignore
 */
function isResponse(obj: any) {
  return isObject(obj) && "data" in obj && "headers" in obj && "status" in obj && "statusText" in obj;
}

/**
 * @ignore
 */
/**
 * Represents the lifecycle state of an `AnyToPromise` operation.
 *
 * @public
 */
export enum AnyToPromiseStatus {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED"
}

/**
 * Describes the high-level response kind produced by `AnyToPromise`.
 *
 * @public
 */
export enum AnyToPromiseResponseTypes {
  STREAM = "STREAM",
  BUFFER = "BUFFER",
  DATA = "DATA"
}

/**
 * Result shape returned by `AnyToPromise` when resolved.
 *
 * Only the symbol itself is documented per the symbols-only rule (member fields are self-explanatory).
 *
 * @typeParam T Type of the `data` field.
 * @public
 */
export interface AnyPromiseResult<T = any> {
  state: AnyToPromiseStatus;
  type: AnyToPromiseResponseTypes;
  status?: number;
  headers?: Record<string, any>;
  data: T;
}

/**
 * Utility that normalizes various async-like values (Promise, Observable, Stream, plain value)
 * into a single Promise-based flow with a consistent result shape.
 *
 * This class is used internally to handle controller/middleware outputs, but can be
 * reused anywhere a unified async handling is desired.
 *
 * @typeParam T Type of the resulting payload.
 * @public
 */
export class AnyToPromise<T = any> {
  public status = AnyToPromiseStatus.PENDING;

  #resolves: any;
  #rejects: any;
  #hasNextFunction = false;
  #promise?: Promise<AnyPromiseResult<T>>;
  #result?: AnyPromiseResult<T>;
  #error: any;

  // no destructuring default: subclasses call super() without options, once per request
  constructor(options?: {hasNextFunction?: boolean}) {
    this.#hasNextFunction = options?.hasNextFunction ?? false;
  }

  get next() {
    this.#hasNextFunction = true;

    return (error?: any) => {
      if (this.isDone()) {
        return;
      }

      return error ? this.reject(error) : this.resolve({type: AnyToPromiseResponseTypes.DATA});
    };
  }

  isDone(): boolean {
    return this.status !== AnyToPromiseStatus.PENDING;
  }

  /**
   * Call `cb` and return a promise of its normalized result.
   *
   * @param cb Function whose return value is normalized.
   * @returns A promise resolved with the result, or rejected with the error thrown or rejected by `cb`.
   */
  call(cb: Function): Promise<AnyPromiseResult<T>> {
    if (this.isDone()) {
      return Promise.resolve(this as any);
    }

    let result: MaybePromise<AnyPromiseResult<T>>;

    try {
      result = this.run(cb);
    } catch (er) {
      return Promise.reject(er);
    }

    return isPromise(result) ? result : Promise.resolve(result);
  }

  /**
   * Call `cb` and return its normalized result without waiting for a microtask when it is synchronous.
   *
   * The result is returned as is for a plain value, a `Buffer`, a stream, a response object or a canceled response.
   * A promise is returned for a promise, an observable, or while a requested `next` function has not been called.
   *
   * @param cb Function whose return value is normalized.
   * @returns The result, or a promise of the result.
   * @throws The error thrown synchronously by `cb`.
   */
  run(cb: Function): MaybePromise<AnyPromiseResult<T>> {
    if (this.isDone()) {
      return this as any;
    }

    try {
      this.handle(cb());
    } catch (er) {
      this.reject(er);
    }

    switch (this.status) {
      case AnyToPromiseStatus.RESOLVED:
      case AnyToPromiseStatus.CANCELED:
        return this.#promise || this.#result!;
      case AnyToPromiseStatus.REJECTED:
        if (this.#promise) {
          return this.#promise;
        }

        throw this.#error;
      default:
        return this.#getPromise();
    }
  }

  reject(er: any) {
    if (this.isDone()) {
      return;
    }

    this.done(AnyToPromiseStatus.REJECTED);

    this.#error = er;
    this.#rejects?.(er);
  }

  resolve(response: any = {}) {
    if (this.isDone()) {
      return;
    }

    this.done(AnyToPromiseStatus.RESOLVED);

    this.#settle({...response, state: AnyToPromiseStatus.RESOLVED});
  }

  destroy() {}

  cancel() {
    if (this.isDone()) {
      return;
    }

    this.done(AnyToPromiseStatus.CANCELED);

    this.#settle({state: AnyToPromiseStatus.CANCELED} as AnyPromiseResult<T>);
  }

  done(status: AnyToPromiseStatus) {
    this.destroy();
    this.status = status;
  }

  handle(process: any, additionalProps = {}): any {
    if (this.isDone()) {
      return;
    }

    if (process) {
      if (this.isCanceledResponse(process)) {
        // ABANDON
        return this.cancel();
      }

      if (isObservable(process)) {
        process = process.toPromise();
      }

      if (isResponse(process)) {
        return this.handle(process.data, {
          ...additionalProps,
          status: process.status,
          headers: process.headers
        });
      }

      if (isStream(process)) {
        return this.resolve({...additionalProps, type: AnyToPromiseResponseTypes.STREAM, data: process});
      }
      if (Buffer.isBuffer(process)) {
        return this.resolve({...additionalProps, type: AnyToPromiseResponseTypes.BUFFER, data: process});
      }

      if (isPromise(process)) {
        const onError = (error: any) => {
          // a nullish reason has no response: reading error.response threw and the call never settled
          if (error && error.response && isResponse(error.response)) {
            return this.handle(error.response);
          }

          return this.reject(error);
        };

        // one then() instead of then().catch(): one promise less per async handler. onError must also
        // receive what the removed catch() received: an error thrown while handling the value,
        // and the rejection of a nested promise returned by handle()
        return process.then((result: any) => {
          let out: any;

          try {
            out = this.handle(result, additionalProps);
          } catch (er) {
            return onError(er);
          }

          // Promise.resolve() adopts a thenable as then() did with the returned value: its then() receives
          // two functions. For a native promise, it returns the same promise
          return out && typeof out.then === "function" ? Promise.resolve(out).then(undefined, onError) : out;
        }, onError);
      }
    }

    if (!this.#hasNextFunction) {
      // no next function and empty response
      return this.resolve({
        ...additionalProps,
        data: process,
        type: AnyToPromiseResponseTypes.DATA
      });
    }
  }

  protected isCanceledResponse(process: any) {
    return process === AnyToPromiseStatus.CANCELED;
  }

  #settle(result: AnyPromiseResult<T>) {
    this.#result = result;
    this.#resolves?.(result);
  }

  // the promise is only created when a caller has to wait: a synchronous result never allocates it
  #getPromise() {
    return (this.#promise ||= new Promise((resolve: any, reject: any) => {
      this.#resolves = resolve;
      this.#rejects = reject;
    }));
  }
}
