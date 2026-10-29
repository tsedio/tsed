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
});
