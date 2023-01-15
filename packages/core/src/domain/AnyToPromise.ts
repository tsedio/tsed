import {isObject} from "../utils/objects/isObject";
import {isObservable} from "../utils/objects/isObservable";
import {isPromise} from "../utils/objects/isPromise";
import {isStream} from "../utils/objects/isStream";

/**
 * @ignore
 */
function isResponse(obj: any) {
  return isObject(obj) && "data" in obj && "headers" in obj && "status" in obj && "statusText" in obj;
}

/**
 * @ignore
 */
export enum AnyToPromiseStatus {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED"
}

export enum AnyToPromiseResponseTypes {
  STREAM = "STREAM",
  BUFFER = "BUFFER",
  DATA = "DATA"
}

export interface AnyPromiseResult<T = any> {
  state: AnyToPromiseStatus;
  type: AnyToPromiseResponseTypes;
  status?: number;
  headers?: Record<string, any>;
  data: T;
}

export class AnyToPromise<T = any> {
  public status = AnyToPromiseStatus.PENDING;
  public args: any[];

  #resolves: any;
  #rejects: any;
  #hasNextFunction = false;

  readonly #promise: Promise<AnyPromiseResult<T>>;

  constructor({hasNextFunction = false}: {hasNextFunction?: boolean} = {}) {
    this.#hasNextFunction = hasNextFunction;

    this.#promise = new Promise((resolve: any, reject: any) => {
      this.#resolves = resolve;
      this.#rejects = reject;
    });
  }

  isDone(): boolean {
    return this.status !== AnyToPromiseStatus.PENDING;
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

  /**
   *
   */
  async call(cb: Function): Promise<AnyPromiseResult<T>> {
    if (this.isDone()) {
      return this as any;
    }

    try {
      this.handle(cb());
    } catch (er) {
      this.reject(er);
    }

    return this.#promise;
  }

  reject(er: any) {
    if (this.isDone()) {
      return;
    }

    this.done(AnyToPromiseStatus.REJECTED);

    this.#rejects(er);
  }

  resolve(response: any = {}) {
    if (this.isDone()) {
      return;
    }

    this.done(AnyToPromiseStatus.RESOLVED);

    this.#resolves({...response, state: AnyToPromiseStatus.RESOLVED});
  }

  destroy() {}

  cancel() {
    if (this.isDone()) {
      return;
    }

    this.done(AnyToPromiseStatus.CANCELED);

    return this.#resolves({state: AnyToPromiseStatus.CANCELED});
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
      if (isStream(process) || Buffer.isBuffer(process)) {
        return this.resolve({...additionalProps, type: AnyToPromiseResponseTypes.BUFFER, data: process});
      }

      if (isPromise(process)) {
        return process
          .then((result: any) => this.handle(result, additionalProps))
          .catch((error: any) => {
            if (error.response && isResponse(error.response)) {
              return this.handle(error.response);
            }
            return this.reject(error);
          });
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
}
