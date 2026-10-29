import {AnyToPromise, AnyToPromiseStatus} from "./AnyToPromise.js";
import {catchAsyncError} from "./catchError.js";
import {createReadStream} from "node:fs";
import {isStream} from "./isStream.js";
import {of} from "rxjs";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

describe("AnyToPromise", () => {
  it("should handle sync value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return "test";
    });

    resolver.cancel();
    resolver.resolve();
    resolver.next();
    resolver.reject(new Error(""));

    await resolver.call(() => {
      return "test";
    });

    expect(result).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
  });

  it("should handle async value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Promise.resolve("test");
    });

    expect(result).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
  });
  it("should handle canceled async value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Promise.resolve(AnyToPromiseStatus.CANCELED);
    });

    expect(result).toEqual({state: "CANCELED"});
  });
  it("should handle response with data", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Promise.resolve({
        data: "data",
        headers: {
          "Content-Type": "type"
        },
        status: 200,
        statusText: "OK"
      });
    });

    expect(result).toEqual({
      state: "RESOLVED",
      data: "data",
      headers: {
        "Content-Type": "type"
      },
      status: 200,
      type: "DATA"
    });
  });
  it("should handle async undefined value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Promise.resolve(undefined);
    });

    expect(result).toEqual({state: "RESOLVED", data: undefined, type: "DATA"});
  });
  it("should handle observable", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return of("test");
    });

    expect(result).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
  });
  it("should handle buffer", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Buffer.from("test");
    });

    expect(Buffer.isBuffer(result.data)).toBe(true);
    expect(result.type).toBe("BUFFER");
  });
  it("should handle stream", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return createReadStream(rootDir + "/__mock__/response.txt");
    });

    expect(result.type).toBe("STREAM");
    expect(isStream(result.data)).toBe(true);
  });

  it("should catch error", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(() => {
      return Promise.resolve("test");
    });

    expect(result).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
  });

  it("should handle async error", async () => {
    const resolver = new AnyToPromise();

    const error = await catchAsyncError(() => {
      return resolver.call(() => {
        return Promise.reject(new Error("test"));
      });
    });

    expect(error?.message).toEqual("test");
  });

  it("should handle sync error", async () => {
    const resolver = new AnyToPromise();

    const error = await catchAsyncError(() => {
      return resolver.call(() => {
        throw new Error("test");
      });
    });

    expect(error?.message).toEqual("test");
  });

  it("should handle next callback with error", async () => {
    const resolver = new AnyToPromise();
    const {next} = resolver;

    const error = await catchAsyncError(() => {
      return resolver.call(() => {
        next(new Error("test"));
        return Promise.resolve();
      });
    });

    expect(error?.message).toEqual("test");
  });

  describe("hasNextFunction option", () => {
    it("should resolve the returned value without options or with an empty object", async () => {
      expect(await new AnyToPromise().call(() => "test")).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
      expect(await new AnyToPromise({}).call(() => "test")).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
    });

    it("should wait for next() when hasNextFunction is true", async () => {
      const resolver = new AnyToPromise({hasNextFunction: true});
      let next: any;

      const promise = resolver.call(() => {
        next = () => resolver.resolve({data: "from next"});
        return undefined;
      });

      expect(resolver.status).toEqual(AnyToPromiseStatus.PENDING);

      next();

      expect(await promise).toEqual({state: "RESOLVED", data: "from next"});
    });
  });

  it("should resolve a buffer returned by a promise as BUFFER", async () => {
    const buffer = Buffer.from("test");
    const result = await new AnyToPromise().call(() => Promise.resolve(buffer));

    expect(result).toEqual({state: "RESOLVED", data: buffer, type: "BUFFER"});
  });

  describe("errors of an async value", () => {
    // fails fast instead of waiting for the test timeout when the promise never settles
    function settle<T>(promise: Promise<T>) {
      return Promise.race([
        promise.then(
          (value) => ({value}),
          (error) => ({error})
        ),
        new Promise<{hang: true}>((resolve) => setTimeout(() => resolve({hang: true}), 200))
      ]);
    }

    const response = {data: "data", headers: {"x-test": "1"}, status: 400, statusText: "Bad Request"};

    // reading lift (isObservable) throws while the resolved value is handled
    function throwingValue(error: any) {
      return {
        get lift(): any {
          throw error;
        }
      };
    }

    function observableOf(toPromise: () => Promise<any>) {
      return {lift() {}, subscribe() {}, toPromise};
    }

    it("should resolve the response of a rejected promise", async () => {
      const result = await settle(new AnyToPromise().call(() => Promise.reject({response})));

      expect(result).toEqual({value: {state: "RESOLVED", data: "data", headers: {"x-test": "1"}, status: 400, type: "DATA"}});
    });

    it("should reject when handling the resolved value throws", async () => {
      const error = new Error("handle error");
      const result = await settle(new AnyToPromise().call(() => Promise.resolve(throwingValue(error))));

      expect(result).toEqual({error});
    });

    it("should resolve the response of an error thrown while handling the resolved value", async () => {
      const result = await settle(new AnyToPromise().call(() => Promise.resolve(throwingValue({response}))));

      expect(result).toEqual({value: {state: "RESOLVED", data: "data", headers: {"x-test": "1"}, status: 400, type: "DATA"}});
    });

    it("should resolve an observable returned by a promise", async () => {
      const result = await settle(new AnyToPromise().call(() => Promise.resolve(observableOf(() => Promise.resolve("test")))));

      expect(result).toEqual({value: {state: "RESOLVED", data: "test", type: "DATA"}});
    });

    it("should resolve the response of a nested rejected promise", async () => {
      const result = await settle(new AnyToPromise().call(() => Promise.resolve(observableOf(() => Promise.reject({response})))));

      expect(result).toEqual({value: {state: "RESOLVED", data: "data", headers: {"x-test": "1"}, status: 400, type: "DATA"}});
    });

    it("should reject when the nested error handler throws", async () => {
      // a nested promise rejected with undefined: reading error.response throws a TypeError, caught by the outer handler
      const result: any = await settle(new AnyToPromise().call(() => Promise.resolve(observableOf(() => Promise.reject(undefined)))));

      expect(result.error).toBeInstanceOf(TypeError);
    });

    it("should resolve the value of a thenable that is not a native promise", async () => {
      const thenable = {
        then(resolve: any) {
          resolve("test");
          return thenable;
        },
        catch() {
          return thenable;
        }
      };
      const result = await settle(new AnyToPromise().call(() => thenable));

      expect(result).toEqual({value: {state: "RESOLVED", data: "test", type: "DATA"}});
    });

    it("should reject when a subclass check throws on the resolved value", async () => {
      const error = new Error("subclass error");

      class Resolver extends AnyToPromise {
        protected isCanceledResponse(process: any) {
          if (process === "boom") {
            throw error;
          }

          return super.isCanceledResponse(process);
        }
      }

      const result = await settle(new Resolver().call(() => Promise.resolve("boom")));

      expect(result).toEqual({error});
    });
  });
});
