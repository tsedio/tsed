import filedirname from "filedirname";
import {createReadStream} from "fs";
import {of} from "rxjs";
import {catchAsyncError} from "../utils/catchError";
import {isStream} from "../utils/objects/isStream";
import {AnyToPromise, AnyToPromiseStatus} from "./AnyToPromise";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

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

    const result = await resolver.call(async () => {
      return "test";
    });

    expect(result).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
  });
  it("should handle canceled async value", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return AnyToPromiseStatus.CANCELED;
    });

    expect(result).toEqual({state: "CANCELED"});
  });
  it("should handle response with data", async () => {
    const resolver = new AnyToPromise();

    const result = await resolver.call(async () => {
      return {
        data: "data",
        headers: {
          "Content-Type": "type"
        },
        status: 200,
        statusText: "OK"
      };
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

    const result = await resolver.call(async () => {
      return undefined;
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

    const result = await resolver.call(async () => {
      return "test";
    });

    expect(result).toEqual({state: "RESOLVED", data: "test", type: "DATA"});
  });

  it("should handle async error", async () => {
    const resolver = new AnyToPromise();

    const error = await catchAsyncError(() => {
      return resolver.call(async () => {
        throw new Error("test");
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
      return resolver.call(async () => {
        next(new Error("test"));
      });
    });

    expect(error?.message).toEqual("test");
  });
});
