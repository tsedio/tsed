/**
 * Represents session data associated with a socket connection, providing a compatibility layer with Ts.ED v7 by wrapping a `socket.data` which is used to archive recoverability and resiliency to a `Map` instance.
 *
 * This class implements the `Map<string, unknown>` interface and provides methods and properties to manage and manipulate session data.
 *
 * @internal This class is designed for internal use.
 */
export class SocketSessionData extends Map<string, unknown> {
  readonly #data: Record<string, unknown>;

  get size(): number {
    return Object.keys(this.#data).length;
  }

  static get [Symbol.species]() {
    return Map;
  }

  constructor(data: Record<string, unknown>) {
    super();
    this.#data = data;
  }

  public *[Symbol.iterator](): MapIterator<[string, unknown]> {
    for (const key in this.#data) {
      yield [key, this.#data[key]];
    }
  }

  public clear(): void {
    for (const key in this.#data) {
      delete this.#data[key];
    }
  }

  public delete(key: string): boolean {
    const hasKey = key in this.#data;
    if (hasKey) {
      delete this.#data[key];
      return true;
    }
    return false;
  }

  public *entries(): MapIterator<[string, unknown]> {
    for (const key in this.#data) {
      yield [key, this.#data[key]];
    }
  }

  public forEach(callbackfn: (value: unknown, key: string, map: Map<string, unknown>) => void, thisArg?: any): void {
    for (const key in this.#data) {
      callbackfn.call(thisArg, this.#data[key], key, this);
    }
  }

  public get(key: string): unknown | undefined {
    return this.#data[key];
  }

  public has(key: string): boolean {
    return key in this.#data;
  }

  public *keys(): MapIterator<string> {
    for (const key in this.#data) {
      yield key;
    }
  }

  public set(key: string, value: unknown): this {
    this.#data[key] = value;
    return this;
  }

  public *values(): MapIterator<unknown> {
    for (const key in this.#data) {
      yield this.#data[key];
    }
  }
}
